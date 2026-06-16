"""
XMI Parser — gpt-oss-20b-UML-Generator output → PlantUML code.

Model này luôn trả về XMI 2.5.1 chuẩn, bất kể prompt yêu cầu format nào.
Module này parse XMI và chuyển thành PlantUML để frontend có thể render.

Hỗ trợ hiện tại:
  - Use Case Diagram (Actor, UseCase, Association, Include, Extend)
  - Xử lý cấu trúc lồng nhau: actors/usecases có thể nằm trong uml:Component

Kế hoạch tương lai:
  - Class Diagram (Class, Attribute, Operation, Association)
"""

import xml.etree.ElementTree as ET

# ── Namespace constants ───────────────────────────────────────────────────────
_XMI = "http://www.omg.org/spec/XMI/20131001"
_UML = "http://www.omg.org/spec/UML/20131001"


def _attr(elem: ET.Element, *local_names: str) -> str:
    """
    Lấy giá trị attribute, thử namespace đầy đủ trước, rồi dạng prefix.
    VD: xmi:id="actor_1" → ET parse thành {XMI_NS}id = "actor_1"
    """
    for name in local_names:
        for ns in (_XMI, _UML):
            val = elem.get(f"{{{ns}}}{name}")
            if val:
                return val
        val = elem.get(f"xmi:{name}") or elem.get(name)
        if val:
            return val
    return ""


def _find_model(root: ET.Element) -> ET.Element:
    """Tìm phần tử <uml:Model> trong cây XML, fallback về root."""
    for child in root:
        if "Model" in child.tag:
            return child
    return root


def _build_id_map(model: ET.Element) -> dict[str, str]:
    """
    Xây dựng mapping xmi:id → name cho TẤT CẢ phần tử (kể cả lồng sâu).
    Cần để resolve idref trong Association/Include/Extend.
    """
    id_map: dict[str, str] = {}
    for elem in model.iter():
        xmi_id = _attr(elem, "id")
        name = elem.get("name", "")
        if xmi_id and name:
            id_map[xmi_id] = name
    return id_map


def _resolve(ref: str, id_map: dict[str, str]) -> str:
    """Resolve xmi:idref → name. Trả về nguyên ref nếu không tìm thấy."""
    return id_map.get(ref, ref)


def _tag_local(elem: ET.Element) -> str:
    """Lấy local tag name, bỏ namespace URI."""
    tag = elem.tag
    return tag.split("}")[-1] if "}" in tag else tag


# ── Diagram type detection ────────────────────────────────────────────────────

def detect_diagram_type(xmi_text: str) -> str:
    """
    Phát hiện loại sơ đồ dựa trên pattern matching.
    Returns: "usecase" | "class" | "unknown"
    """
    if any(t in xmi_text for t in ["uml:Actor", "uml:UseCase", "uml:Include", "uml:Extend"]):
        return "usecase"
    if any(t in xmi_text for t in ["uml:Class", "ownedAttribute", "ownedOperation"]):
        return "class"
    return "unknown"


def is_xmi(text: str) -> bool:
    """Kiểm tra nhanh xem text có phải XMI không."""
    s = text.strip()
    return s.startswith("<?xml") or "<xmi:XMI" in s or "<uml:Model" in s


# ── Use Case parser ───────────────────────────────────────────────────────────

def parse_usecase_xmi(xmi_text: str) -> str:
    """
    Parse XMI Use Case Diagram → PlantUML string.

    Hỗ trợ cấu trúc thực tế của model:
      - Actors/UseCases/Associations lồng trong <packagedElement xmi:type="uml:Component">
      - memberEnd dùng xmi:idref trỏ thẳng đến actor/usecase ID
      - Include: includingCase + addition
      - Extend:  extendedCase + extension

    Returns PlantUML string, hoặc "" nếu parse thất bại.
    """
    try:
        root = ET.fromstring(xmi_text.strip())
    except ET.ParseError as exc:
        print(f"[XMIParser] XML parse error: {exc}")
        return ""

    model = _find_model(root)
    id_map = _build_id_map(model)

    # Tên hệ thống — ưu tiên Component/Package bên trong Model
    system_name = model.get("name", "System")
    for child in model:
        xmi_type = _attr(child, "type")
        child_name = child.get("name", "")
        if ("Component" in xmi_type or "Package" in xmi_type) and child_name:
            system_name = child_name
            break

    actors: list[str] = []
    usecases: list[str] = []
    # (source_name, target_name, rel_type)
    relations: list[tuple[str, str, str]] = []

    # Dùng model.iter() để duyệt TẤT CẢ descendants
    # → xử lý được cấu trúc lồng nhau bên trong uml:Component
    for elem in model.iter():
        xmi_type = _attr(elem, "type")
        if not xmi_type:
            continue

        name = elem.get("name", "")

        # ── uml:Actor ──────────────────────────────────────────────────────────
        if "Actor" in xmi_type and name and name not in actors:
            actors.append(name)

        # ── uml:UseCase ────────────────────────────────────────────────────────
        elif "UseCase" in xmi_type and name and name not in usecases:
            usecases.append(name)

        # ── uml:Association ────────────────────────────────────────────────────
        elif ("Association" in xmi_type
              and "Include" not in xmi_type
              and "Extend" not in xmi_type):
            end_refs: list[str] = []
            for child in elem:
                tl = _tag_local(child)
                if tl == "memberEnd":
                    ref = _attr(child, "idref")
                    if ref:
                        end_refs.append(ref)
                elif tl == "ownedEnd":
                    # ownedEnd dùng type="id" thay vì idref
                    t = child.get("type", "")
                    if t:
                        end_refs.append(t)

            names: list[str] = []
            for ref in end_refs:
                n = _resolve(ref, id_map)
                if n and n not in names:
                    names.append(n)

            if len(names) >= 2:
                src, tgt = names[0], names[1]
                # Đảm bảo Actor ở phía nguồn (bên trái mũi tên)
                if tgt in actors and src not in actors:
                    src, tgt = tgt, src
                relations.append((src, tgt, "association"))

        # ── uml:Include ────────────────────────────────────────────────────────
        elif "Include" in xmi_type:
            inc, add = "", ""
            for child in elem:
                tl = _tag_local(child)
                ref = _attr(child, "idref")
                if tl == "includingCase":
                    inc = _resolve(ref, id_map)
                elif tl == "addition":
                    add = _resolve(ref, id_map)
            if inc and add:
                relations.append((inc, add, "include"))

        # ── uml:Extend ─────────────────────────────────────────────────────────
        elif "Extend" in xmi_type:
            ext_case, ext_ion = "", ""
            for child in elem:
                tl = _tag_local(child)
                ref = _attr(child, "idref")
                if tl == "extendedCase":
                    ext_case = _resolve(ref, id_map)
                elif tl == "extension":
                    ext_ion = _resolve(ref, id_map)
            if ext_case and ext_ion:
                # extension ..> extendedCase
                relations.append((ext_ion, ext_case, "extend"))

    # ── Validation ─────────────────────────────────────────────────────────────
    if not actors and not usecases:
        print("[XMIParser] Không tìm thấy Actor hoặc UseCase trong XMI.")
        return ""

    # ── Build PlantUML ──────────────────────────────────────────────────────────
    lines: list[str] = ["@startuml", "left to right direction", ""]

    for actor in actors:
        lines.append(f'actor "{actor}"')

    if actors:
        lines.append("")

    lines.append(f'rectangle "{system_name}" {{')
    for uc in usecases:
        lines.append(f'  usecase "{uc}"')
    lines.append("}")
    lines.append("")

    for src, tgt, rel_type in relations:
        if rel_type == "association":
            lines.append(f'"{src}" --> "{tgt}"')
        elif rel_type == "include":
            lines.append(f'"{src}" ..> "{tgt}" : <<include>>')
        elif rel_type == "extend":
            lines.append(f'"{src}" ..> "{tgt}" : <<extend>>')

    lines.extend(["", "@enduml"])

    plantuml_code = "\n".join(lines)
    print(
        f"[XMIParser] OK — "
        f"{len(actors)} actors, {len(usecases)} use cases, {len(relations)} relations"
    )
    return plantuml_code


# ── Public API ────────────────────────────────────────────────────────────────

def xmi_to_plantuml(xmi_text: str, hint_type: str = "auto") -> tuple[str, str]:
    """
    Entry point chính.

    Args:
        xmi_text:  Chuỗi XMI từ model
        hint_type: Gợi ý loại sơ đồ ("auto" | "usecase" | "class")

    Returns:
        (plantuml_code, diagram_type)
    """
    diagram_type = hint_type if hint_type != "auto" else detect_diagram_type(xmi_text)

    if diagram_type == "usecase":
        return parse_usecase_xmi(xmi_text), "usecase"

    if diagram_type == "class":
        print("[XMIParser] Class diagram parser chưa implement.")
        return "", "class"

    print(f"[XMIParser] Không nhận diện được loại sơ đồ.")
    return "", "unknown"
