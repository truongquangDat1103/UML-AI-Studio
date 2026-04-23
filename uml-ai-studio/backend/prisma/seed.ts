import { PrismaClient, Role, DiagramType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { DEFAULT_SYSTEM_PROMPT_USECASE, DEFAULT_SYSTEM_PROMPT_CLASS, BCRYPT_ROUNDS } from '../src/utils/constants.js'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // 1. Create admin user
    const adminPasswordHash = await bcrypt.hash('Admin@123', BCRYPT_ROUNDS)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@umlstudio.ai' },
        update: {},
        create: {
            email: 'admin@umlstudio.ai',
            passwordHash: adminPasswordHash,
            name: 'Administrator',
            role: Role.ADMIN,
            dailyQuota: 100,
        },
    })
    console.log(`✅ Admin user: ${admin.email}`)

    // 2. Create AIConfig singleton
    await prisma.aIConfig.upsert({
        where: { id: 'singleton' },
        update: {},
        create: {
            id: 'singleton',
            model: 'claude-sonnet-4-20250514',
            systemPromptUsecase: DEFAULT_SYSTEM_PROMPT_USECASE,
            systemPromptClass: DEFAULT_SYSTEM_PROMPT_CLASS,
            temperature: 0.7,
            maxTokens: 4096,
        },
    })
    console.log('✅ AI Config singleton created')

    // 3. Create default templates
    const templates = [
        {
            title: 'Hệ thống đặt hàng online',
            description: 'Use Case Diagram cho hệ thống thương mại điện tử với các chức năng đặt hàng, thanh toán, quản lý sản phẩm.',
            diagramType: DiagramType.USECASE,
            mermaidCode: `graph TD
    Customer((Khách hàng))
    Admin((Quản trị viên))
    
    UC1[Đăng ký / Đăng nhập]
    UC2[Xem sản phẩm]
    UC3[Thêm vào giỏ hàng]
    UC4[Đặt hàng]
    UC5[Thanh toán]
    UC6[Theo dõi đơn hàng]
    UC7[Quản lý sản phẩm]
    UC8[Xử lý đơn hàng]
    
    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Admin --> UC7
    Admin --> UC8
    UC4 -.->|include| UC5
    UC4 -.->|include| UC3`,
            promptExample: 'Thiết kế hệ thống đặt hàng online cho một website thương mại điện tử. Hệ thống cho phép khách hàng xem sản phẩm, thêm vào giỏ hàng, đặt hàng và thanh toán. Admin có thể quản lý sản phẩm và xử lý đơn hàng.',
            createdBy: admin.id,
        },
        {
            title: 'Hệ thống quản lý thư viện',
            description: 'Use Case Diagram cho hệ thống thư viện với các chức năng mượn/trả sách, quản lý thành viên.',
            diagramType: DiagramType.USECASE,
            mermaidCode: `graph TD
    Reader((Độc giả))
    Librarian((Thủ thư))
    
    UC1[Tìm kiếm sách]
    UC2[Mượn sách]
    UC3[Trả sách]
    UC4[Đăng ký thẻ]
    UC5[Quản lý sách]
    UC6[Quản lý thành viên]
    UC7[Báo cáo thống kê]
    
    Reader --> UC1
    Reader --> UC2
    Reader --> UC3
    Reader --> UC4
    Librarian --> UC5
    Librarian --> UC6
    Librarian --> UC7
    UC2 -.->|include| UC1`,
            promptExample: 'Thiết kế hệ thống quản lý thư viện. Độc giả có thể tìm kiếm sách, mượn sách, trả sách và đăng ký thẻ. Thủ thư quản lý sách, quản lý thành viên và xem báo cáo thống kê.',
            createdBy: admin.id,
        },
        {
            title: 'E-commerce Product',
            description: 'Class Diagram cho hệ thống sản phẩm thương mại điện tử với Product, Category, Review.',
            diagramType: DiagramType.CLASS,
            mermaidCode: `classDiagram
    class Product {
        -id: String
        -name: String
        -price: Float
        -stock: Int
        -description: String
        +getDetails(): ProductDTO
        +updateStock(qty: Int): void
        +calculateDiscount(): Float
    }
    class Category {
        -id: String
        -name: String
        -parentId: String
        +getProducts(): Product[]
    }
    class Review {
        -id: String
        -rating: Int
        -comment: String
        -createdAt: Date
        +approve(): void
    }
    class User {
        -id: String
        -email: String
        -name: String
        +addReview(product: Product, rating: Int): Review
    }
    
    Product "*" --> "1" Category : belongs to
    Product "1" --> "*" Review : has
    User "1" --> "*" Review : writes`,
            promptExample: 'Design a class diagram for an e-commerce product system. Include Product, Category, Review and User classes with their relationships.',
            createdBy: admin.id,
        },
        {
            title: 'User Authentication System',
            description: 'Class Diagram cho hệ thống xác thực người dùng với User, Session, Token.',
            diagramType: DiagramType.CLASS,
            mermaidCode: `classDiagram
    class User {
        -id: String
        -email: String
        -passwordHash: String
        -role: Role
        +login(password: String): Token
        +register(): User
        +changePassword(): void
    }
    class Session {
        -id: String
        -userId: String
        -expiresAt: Date
        -isActive: Boolean
        +validate(): Boolean
        +revoke(): void
    }
    class Token {
        -accessToken: String
        -refreshToken: String
        -expiresIn: Int
        +verify(): Payload
        +refresh(): Token
    }
    class Role {
        <<enumeration>>
        ADMIN
        USER
    }
    
    User "1" --> "*" Session : has
    User "1" --> "*" Token : generates
    User --> Role : has`,
            promptExample: 'Design a class diagram for a user authentication system with JWT tokens, sessions, and role-based access control.',
            createdBy: admin.id,
        },
    ]

    for (const template of templates) {
        await prisma.template.create({ data: template })
    }
    console.log(`✅ ${templates.length} templates created`)

    console.log('\n🎉 Seeding complete!')
    console.log('   Admin: admin@umlstudio.ai / Admin@123')
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
