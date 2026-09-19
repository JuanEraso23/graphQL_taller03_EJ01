const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// 1. DATOS EN MEMORIA (Simulación - SIN MySQL)
const usuariosData = [
    { id: 1, nombre: 'Ana Gómez', correo: 'ana@correo.com' },
    { id: 2, nombre: 'Carlos Pérez', correo: 'carlos@correo.com' },
    { id: 3, nombre: 'Laura Torres', correo: 'laura@correo.com' },
    { id: 4, nombre: 'Miguel Rodríguez', correo: 'miguel@correo.com' },
    { id: 5, nombre: 'Sofía Martínez', correo: 'sofia@correo.com' }
];

// 2. ESQUEMA (Definición de tipos y consultas)
// Según la guía: type Usuario, type Query con usuarios y usuario(id: Int!)
const schema = buildSchema(`
    # Definición del tipo Usuario (Tipos personalizados)
    type Usuario {
        id: Int!
        nombre: String!
        correo: String!
    }

    # Consultas disponibles (Queries)
    type Query {
        # Obtener todos los usuarios (sin parámetros)
        usuarios: [Usuario!]!
        
        # Obtener un usuario específico por ID (con parámetro obligatorio)
        usuario(id: Int!): Usuario
    }
`);

// 3. RESOLVERS (La lógica que responde a las consultas)
const root = {
    // Consulta: Listar todos los usuarios
    usuarios: () => {
        console.log('📋 Listando todos los usuarios');
        return usuariosData;
    },

    // Consulta: Buscar usuario por ID
    usuario: ({ id }) => {
        console.log(`🔍 Buscando usuario con ID: ${id}`);
        const usuario = usuariosData.find(u => u.id === id);
        if (!usuario) {
            console.log(`❌ Usuario con ID ${id} no encontrado`);
            return null;
        }
        console.log(`✅ Usuario encontrado: ${usuario.nombre}`);
        return usuario;
    }
};

// 4. CONFIGURACIÓN DEL SERVIDOR
const app = express();

// Ruta para GraphQL con GraphiQL habilitado
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,  // Habilita la interfaz visual de pruebas
}));

// 5. INICIAR SERVIDOR
const PORT = 4000;
app.listen(PORT, () => {
    console.log('========================================');
    console.log('✅ SERVIDOR GRAPHQL - NIVEL 2');
    console.log('========================================');
    console.log(`📝 Abre http://localhost:${PORT}/graphql en tu navegador`);
    console.log('========================================');
    console.log('📋 CONSULTAS DISPONIBLES:');
    console.log('   1. usuarios - Listar todos');
    console.log('   2. usuario(id: Int!) - Buscar por ID');
    console.log('========================================');
    console.log(`👥 ${usuariosData.length} usuarios en memoria`);
    console.log('========================================');
    console.log('💡 NO se usa MySQL - Solo datos en memoria');
    console.log('========================================');
});