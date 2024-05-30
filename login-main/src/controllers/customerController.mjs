const controller = {};

controller.login = (req, res) => {
  const { email, password } = req.body;
  req.getConnection((err, connection) => {
    if (err) return res.status(500).send(err);

    connection.query('SELECT * FROM usuarios WHERE correo = ?', [email], (err, results) => {
      if (err) return res.status(501).send(err);
      if (results.length === 0) {
        return res.status(404).send('Email not found');
      }

      const user = results[0];

      console.log(user.pass);
      console.log(password);
      if (password === user.pass) {
        // Si el correo y la contraseña coinciden, puedes iniciar la sesión del usuario aquí
        res.redirect('/dashboard');
      } else {
        res.status(401).send('Incorrect password');
      }

    });
  });
};


controller.register = (req, res) => {
  const { nombre, correo, pass } = req.body;

  req.getConnection((err, connection) => {
    if (err) return res.status(500).send(err);

    const newBeneficiary = {
      nombre,
      correo,
      pass
    };

    connection.query('INSERT INTO usuarios SET ?', newBeneficiary, (err, results) => {
      if (err) return res.status(500).send(err);
      res.render('registration_success'); // Renderizar una vista llamada registration_success
    });
  });
};


controller.save = (req, res) => {
  console.log(req.body);
  res.send(req.body);
};

export default controller;