import express from 'express';
import path from 'path';
import axios from 'axios';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3001;

// Configurar o EJS como motor de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true }));
// Middleware para receber dados em JSON (ex: AJAX)
app.use(express.json());
// Configurar o cookie-parser
app.use(cookieParser());
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
app.post('/login', async (req, res) => {
  const { email, senha: password } = req.body;
  
  try {
    // Enviar requisição para a API NestJS
    const response = await axios.post('http://localhost:3000/login', {email, password});
    // Extrair o JWT Token da resposta
    const { access_token } = response.data;
    // Salvar o token em um cookie
    res.cookie('jwt', access_token, {
      httpOnly: true, // O cookie não pode ser acessado via JavaScript do lado do cliente
      secure: false,  // Defina como true se estiver usando HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    });

    return res.redirect('/');
  } catch (e) {
    console.error(e);
    return res.redirect('/login');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
