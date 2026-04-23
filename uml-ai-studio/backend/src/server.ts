import app from './app.js'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`\n🚀 UML AI Studio Backend running on http://localhost:${PORT}`)
    console.log(`📡 API: http://localhost:${PORT}/api`)
    console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`)
})
