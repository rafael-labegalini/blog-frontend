import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

// Configurar o EJS como motor de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true }));
// Middleware para receber dados em JSON (ex: AJAX)
app.use(express.json());
// Middleware para arquivos estáticos (opcional)
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
  res.render('index', { mensagem: 'Olá, mundo novo!' });
});

// Rota GET para exibir o formulário de login
app.get('/login', (req, res) => {
  res.render('login');
});

// Rota POST para processar o login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  // Aqui você pode adicionar a lógica de autenticação
  // Por enquanto, vamos apenas renderizar uma página de sucesso
  res.render('login-sucesso', { email });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
