"""
ai_model — Package xử lý AI cốt lõi của PBL5.

Import chính:
    from ai_model import AIRoot
"""

from .ai_root import AIRoot
from .rag_manager import RAGManager
from .rule_engine import RuleEngine

__all__ = ["AIRoot", "RAGManager", "RuleEngine"]