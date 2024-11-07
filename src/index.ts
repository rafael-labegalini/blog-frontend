import express, {Request, Response} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import axios from 'axios';

const app = express();
const port = 3001;

// Configurar o EJS como motor de visualização
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true }));
// Middleware para receber dados em JSON (ex: AJAX)
app.use(express.json());
// Middleware para trabalhar com Cookies
app.use(cookieParser());
// Middleware para arquivos estáticos (opcional)
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', async (req: Request, res: Response) => {
  const access_token = req.cookies.access_token;

  const response = await axios.get("http://localhost:3000/users", {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  console.log(response.data);

  res.render('index', { mensagem: 'Olá, mundo novo!' });
});

app.get("/profile", async (req: Request, res: Response) {
  // Aqui você deve chamar a rota /profile da sua API NestJS
  // passando o token de autenticação para exibir os dados do
  // usuário logado
  
  return res.render("profile");
});

// Rota GET para exibir o formulário de login
app.get('/login', (req, res) => {
  res.render('login');
});

// Rota POST para processar o login
app.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  
  const response = await axios.post("http://localhost:3000/login", {
    email,
    password: senha
  });
  const {access_token} = response.data;
  
  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 1 dia em milisegundos
  });
  
  return res.redirect('/');
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
