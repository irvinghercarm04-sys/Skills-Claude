// Menú completo de Café 11•11 (precios en MXN). Edita aquí y corre: node build.mjs
// sizes: [[etiqueta, precio], ...]  ·  opts: grupos de opciones que se eligen al agregar
const FLAVOURS = ['Vainilla', 'Caramelo', 'Crema Irlandesa', 'Avellana', 'Amaretto', 'Menta'];
const MILK = { name: 'Leche', choices: ['Entera', 'Deslactosada'] };
const SHOT = { name: 'Carga extra de café', extra: 10 };
const CHOCO = { name: 'Chocolate', choices: ['Oscuro', 'Blanco'] };
const COMBO = { name: 'Arma tu Combo: Agua del día y Ensalada', extra: 35 };
const CHG = (ch, g) => [['CH', ch], ['G', g]];

export const sections = [
  {
    id: 'calientes', h2: 'Tómate algo calientito',
    lead: 'Precios chico / grande. Elige leche entera o deslactosada; carga extra de café +$10.',
    groups: [
      { label: 'Café', items: [
        { id: 'espresso', name: 'Espresso', sizes: [['Sencillo', 32], ['Doble', 41]], opts: [SHOT] },
        { id: 'americano', name: 'Café Americano', sizes: CHG(32, 41), opts: [SHOT] },
        { id: 'capuchino', name: 'Capuchino', sizes: CHG(43, 52), opts: [MILK, SHOT] },
        { id: 'capuchino-sabor', name: 'Capuchino con sabor', desc: FLAVOURS.join(', ') + '.', sizes: CHG(54, 63), opts: [{ name: 'Sabor', choices: FLAVOURS }, MILK, SHOT] },
        { id: 'latte', name: 'Latte', sizes: CHG(43, 52), opts: [MILK, SHOT] },
        { id: 'latte-sabor', name: 'Latte con sabor', desc: FLAVOURS.join(', ') + '.', sizes: CHG(54, 63), opts: [{ name: 'Sabor', choices: FLAVOURS }, MILK, SHOT] },
        { id: 'moka', name: 'Moka', desc: 'Deliciosa mezcla de café con chocolate oscuro o blanco.', sizes: CHG(54, 63), opts: [CHOCO, MILK, SHOT] },
        { id: 'affogato', name: 'Affogato', desc: 'Espresso con bola de helado de vainilla.', sizes: [['', 49]], opts: [SHOT] },
      ] },
      { label: 'Sin café', items: [
        { id: 'choco-trad', name: 'Chocolate Tradicional', sizes: CHG(49, 58), opts: [MILK] },
        { id: 'choco-blanco', name: 'Chocolate Blanco', sizes: CHG(49, 58), opts: [MILK] },
        { id: 'chai', name: 'Chai Latte', sizes: CHG(49, 58), opts: [MILK] },
        { id: 'matcha', name: 'Green Matcha Latte', sizes: CHG(49, 58), opts: [MILK] },
        { id: 'taro', name: 'Taro Latte', sizes: CHG(49, 58), opts: [MILK] },
        { id: 'tes', name: 'Tés & Tisanas', desc: 'Calientes o frías: Manzanilla-Lavanda, Fresa-Kiwi / Moras Silvestres, Frutas de la Vida.', sizes: CHG(41, 52),
          opts: [{ name: 'Tisana', choices: ['Manzanilla-Lavanda', 'Fresa-Kiwi / Moras Silvestres', 'Frutas de la Vida'] }, { name: 'Temperatura', choices: ['Caliente', 'Fría'] }] },
      ] },
    ],
  },
  {
    id: 'frios', h2: 'Frappés y bebidas frías',
    lead: 'Frappés, smoothies, granizados y chamoyadas en chico o grande. También cerveza y vino.',
    groups: [
      { label: 'Frappés', items: [
        { id: 'f-capuchino', name: 'Capuchino', sizes: CHG(53, 62) },
        { id: 'f-moka', name: 'Moka', desc: 'Café + Chocolate Oscuro o Blanco.', sizes: CHG(53, 62), opts: [CHOCO] },
        { id: 'f-caramel', name: 'Caramel Latte', sizes: CHG(53, 62) },
        { id: 'f-vainilla', name: 'Vainilla Cream Latte', sizes: CHG(53, 62) },
        { id: 'f-avellana', name: 'Avellana Cream', sizes: CHG(53, 62) },
        { id: 'f-cookies', name: 'Cookies & Cream', sizes: CHG(53, 62) },
        { id: 'f-chocolover', name: 'Chocolate Lover', sizes: CHG(53, 62) },
        { id: 'f-white', name: 'White Chocolate', sizes: CHG(53, 62) },
        { id: 'f-chocomenta', name: 'Choco-Menta', sizes: CHG(53, 62) },
        { id: 'f-chai', name: 'Chai Latte', sizes: CHG(53, 62) },
        { id: 'f-matcha', name: 'Green Matcha Latte', sizes: CHG(53, 62) },
      ] },
      { label: 'Otras bebidas', items: [
        { id: 'smoothie', name: 'Smoothies', desc: 'Red-Berries, Taro, Mango, Fresa, Piña Colada.', sizes: CHG(49, 58), opts: [{ name: 'Sabor', choices: ['Red-Berries', 'Taro', 'Mango', 'Fresa', 'Piña Colada'] }] },
        { id: 'granizado', name: 'Granizados', desc: 'Limón, Fresa, Moras, Maracuyá, Mango.', sizes: CHG(49, 58), opts: [{ name: 'Sabor', choices: ['Limón', 'Fresa', 'Moras', 'Maracuyá', 'Mango'] }] },
        { id: 'chamoyada', name: 'Chamoyadas', desc: 'Mango o Limón.', sizes: CHG(49, 58), opts: [{ name: 'Sabor', choices: ['Mango', 'Limón'] }] },
        { id: 'agua-dia', name: 'Agua del día', sizes: [['', 24]] },
        { id: 'limonada', name: 'Limonada o Naranjada', sizes: [['', 32]], opts: [{ name: 'Elige', choices: ['Limonada', 'Naranjada'] }] },
        { id: 'refresco', name: 'Refresco', sizes: [['', 30]] },
        { id: 'ciel', name: 'Agua Ciel', sizes: [['', 22]] },
        { id: 'tecate', name: 'Cerveza Tecate', sizes: [['', 42]] },
        { id: 'xx', name: 'Cerveza XX Lager', sizes: [['', 42]] },
        { id: 'indio', name: 'Cerveza Indio', sizes: [['', 42]] },
        { id: 'heineken', name: 'Cerveza Heineken', sizes: [['', 45]] },
        { id: 'vino', name: 'Vino de la casa', desc: 'Botella.', sizes: [['', 350]] },
      ] },
    ],
  },
  {
    id: 'comer', h2: 'Bagels, chapatas y ensaladas',
    lead: 'Arma tu Combo: elige tu Chapata o Bagel y por $35 más, añade Agua del día y Ensalada.',
    groups: [
      { label: 'Bagels', items: [
        { id: 'bagel-salmon', name: 'Bagel de Salmón', desc: 'Salmón ahumado, queso crema, pepino, cebolla y alcaparras.', sizes: [['', 94]], opts: [COMBO] },
        { id: 'bagel-roast', name: 'Bagel de Roast Beef', desc: 'Roast beef, queso gouda, cebolla caramelizada y arúgula.', sizes: [['', 83]], opts: [COMBO] },
        { id: 'bagel-cheessy', name: 'Cheessy Bagel', desc: 'Cremosa combinación de espinaca, alcachofa, champiñón, tocino y jitomate deshidratado.', sizes: [['', 83]], opts: [COMBO] },
      ] },
      { label: 'Chapatas', items: [
        { id: 'ch-porta', name: 'Chapata La Porta', desc: 'Jamón selva negra, queso gouda, lechuga, pepino y jitomate.', sizes: [['', 79]], opts: [COMBO] },
        { id: 'ch-alcala', name: 'Chapata Puerta de Alcalá', desc: 'Jamón serrano, queso manchego, queso gouda, arúgula y jitomate deshidratado.', sizes: [['', 85]], opts: [COMBO] },
        { id: 'ch-cielo', name: 'Chapata Puerta del Cielo', desc: 'Queso de cabra, rebanadas de pera, cebolla caramelizada y arúgula.', sizes: [['', 83]], opts: [COMBO] },
        { id: 'ch-dijon', name: 'Chapata Dijon', desc: 'Pollo sazonado a la mostaza con lechuga y jitomate frescos.', sizes: [['', 83]], opts: [COMBO] },
      ] },
      { label: 'Más salados', items: [
        { id: 'croissant-jq', name: 'Croissant de Jamón y Queso', desc: 'Jamón ahumado, queso gouda, jitomate y lechuga.', sizes: [['', 54]] },
        { id: 'sandwich-light', name: 'Sandwich Light', desc: 'Jamón de pavo, queso panela y mix de vegetales frescos.', sizes: [['', 58]] },
        { id: 'molletes', name: 'Molletes', sizes: [['Sencillos', 56], ['Con Jamón', 65], ['Con Tocino', 65]] },
        { id: 'chilaquiles', name: 'Chilaquiles verdes', desc: 'Con pollo, crema, queso, aguacate y huevo estrellado.', sizes: [['', 89]] },
      ] },
      { label: 'Ensaladas · todas llevan lechuga y espinaca', items: [
        { id: 'ens-pechugona', name: 'Pechugona', desc: 'Pechuga de pollo, queso panela, jitomate, zanahoria, aceitunas, chips de camote y vinagreta de ajo con especias.', sizes: [['', 76]] },
        { id: 'ens-celestial', name: 'Celestial', desc: 'Manzana, queso de cabra, nuez, arándanos y vinagreta de miel y mostaza.', sizes: [['', 76]] },
        { id: 'ens-entrepuertas', name: 'Entre Puertas', desc: 'Jamón serrano, pera, queso parmesano, arúgula y aderezo de vino tinto.', sizes: [['', 81]] },
      ] },
    ],
  },
  {
    id: 'dulce', h2: 'Antojos dulces y postres',
    lead: 'Los postres los vamos variando: pregunta por los postres del día.',
    groups: [
      { label: 'Antojos dulces', items: [
        { id: 'bagel-nutella', name: 'Bagel con Nutella y Plátano', sizes: [['', 52]] },
        { id: 'bagel-mermelada', name: 'Bagel con Queso Crema y Mermelada', sizes: [['', 52]] },
        { id: 'croissant-mm', name: 'Croissant con Mantequilla y Mermelada', sizes: [['', 39]] },
        { id: 'nutella-pan', name: 'Croissant o Bisquet con Nutella', sizes: [['', 39]], opts: [{ name: 'Pan', choices: ['Croissant', 'Bisquet'] }] },
        { id: 'fruta', name: 'Fruta con Yogurt y Granola', sizes: [['', 48]] },
        { id: 'uchepo', name: 'Uchepo', desc: 'Tamal de elote con Lechera.', sizes: [['', 45]] },
      ] },
      { label: 'Postres', items: [
        { id: 'brownie', name: 'Brownie Triple Chocolate', desc: 'Con helado de vainilla.', sizes: [['', 65]] },
        { id: 'cheesecake', name: 'Cheesecake de Guayaba', sizes: [['', 58]] },
        { id: 'pay-queso', name: 'Pay de Queso con Zarzamora', sizes: [['', 58]] },
        { id: 'muffin', name: 'Muffin de elote', sizes: [['', 42]] },
      ] },
    ],
  },
];
