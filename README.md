# 🎮 Pac-Man Game

Un'implementazione del classico gioco Pac-Man sviluppata con **p5.js** e JavaScript vanilla.

## 🚀 Caratteristiche

- **Movimento fluido**: Pac-Man si muove continuamente quando tieni premuto un tasto direzionale
- **Fantasma intelligenti**: 3 fantasmi con comportamenti diversi che escono dalla base a intervalli regolari
- **Sistema di power-up**: Raccogli le pillole speciali per rendere i fantasmi vulnerabili
- **Punteggio dinamico**: Sistema di punteggio con bonus per cibo e fantasmi mangiati
- **Grafica classica**: Sprites originali per un'esperienza autentica
- **Livelli multipli**: Supporto per diversi livelli di gioco

## 🎯 Obiettivo del Gioco

- **Mangia tutto il cibo** nel labirinto per vincere
- **Evita i fantasmi** o sarai catturato
- **Raccogli le pillole speciali** per rendere i fantasmi vulnerabili
- **Mangia i fantasmi** quando sono vulnerabili per punti bonus

## 🎮 Controlli

- **Frecce direzionali**: Muovi Pac-Man
  - ⬅️ **Sinistra**
  - ➡️ **Destra** 
  - ⬆️ **Su**
  - ⬇️ **Giù**
- **Movimento continuo**: Tieni premuto un tasto per muoverti automaticamente

## 📁 Struttura del Progetto

```
pac-man-main/
├── index.html          # File HTML principale
├── logic.js            # Logica di gioco e meccaniche
├── README.md           # Questo file
├── block.png           # Sprite per i muri del labirinto
├── block2.JPG          # Sprite per i muri secondari
├── food.png            # Sprite per il cibo
├── power.png           # Sprite per le pillole speciali
├── pacman_tile.png     # Sprite per Pac-Man (animato)
├── pacman.png          # Sprite aggiuntivo per Pac-Man
├── ghost1.png          # Sprite per il fantasma 1
├── ghost2.png          # Sprite per il fantasma 2
├── ghost3.png          # Sprite per il fantasma 3
├── ghost1fear.png      # Sprite per il fantasma 1 vulnerabile
├── ghost2fear.png      # Sprite per il fantasma 2 vulnerabile
└── ghost3fear.png      # Sprite per il fantasma 3 vulnerabile
```

## 🛠️ Tecnologie Utilizzate

- **HTML5**: Struttura della pagina
- **CSS3**: Styling e layout
- **JavaScript**: Logica di gioco
- **p5.js**: Libreria per la grafica e l'animazione
- **Canvas API**: Rendering del gioco

## 🚀 Come Giocare

1. **Apri il file `index.html`** nel tuo browser web
2. **Usa le frecce direzionali** per muovere Pac-Man
3. **Raccogli tutto il cibo** (punti gialli) nel labirinto
4. **Evita i fantasmi** che escono dalla base centrale
5. **Raccogli le pillole speciali** (punti grandi) per rendere i fantasmi vulnerabili
6. **Mangia i fantasmi** quando sono vulnerabili per punti bonus

## 🎯 Sistema di Punteggio

- **Cibo normale**: +10 punti
- **Fantasma vulnerabile**: +100 punti
- **Obiettivo**: Mangia tutto il cibo per vincere

## 🎨 Meccaniche di Gioco

### Movimento di Pac-Man
- **Movimento continuo**: Tieni premuto un tasto per muoverti automaticamente
- **Collisioni**: Pac-Man non può attraversare i muri
- **Animazione**: Sprite animato con 8 frame per direzione

### Comportamento dei Fantasmi
- **Spawn**: I fantasmi escono dalla base centrale ogni 5 secondi
- **Movimento casuale**: Si muovono in direzioni casuali
- **Collisioni**: Evitano i muri e cambiano direzione
- **Stati**: Normale o vulnerabile (dopo aver mangiato una pillola speciale)

### Sistema di Power-up
- **Durata**: I fantasmi rimangono vulnerabili per un periodo limitato
- **Effetto visivo**: I fantasmi diventano grigi quando vulnerabili
- **Punti bonus**: Mangiarli quando vulnerabili dà 100 punti

## 🔧 Personalizzazione

### Modificare la Velocità di Movimento
Nel file `logic.js`, modifica la variabile `moveInterval`:
```javascript
var moveInterval = 150; // Riduci per movimento più veloce, aumenta per più lento
```

### Aggiungere Nuovi Livelli
Nel file `logic.js`, nella funzione `Maze()`, aggiungi nuovi array nella variabile `levels`:
```javascript
levels.push([
  // Il tuo nuovo labirinto qui
]);
```

### Simboli del Labirinto
- `*`: Muro principale
- `+`: Muro secondario  
- `-`: Cibo
- `x`: Pillola speciale
- `p`: Posizione iniziale di Pac-Man
- `e1`, `e2`, `e3`: Posizioni iniziali dei fantasmi
- `eout`: Punto di uscita dei fantasmi

## 🐛 Risoluzione Problemi

### Il gioco non si carica
- Assicurati che tutti i file siano nella stessa cartella
- Controlla che il browser supporti JavaScript
- Verifica che la connessione internet sia attiva (per p5.js)

### Le immagini non si caricano
- Controlla che tutti i file immagine siano presenti
- Verifica che i nomi dei file corrispondano esattamente

### Movimento troppo veloce/lento
- Modifica la variabile `moveInterval` in `logic.js`
- Valori più bassi = movimento più veloce
- Valori più alti = movimento più lento

## 📝 Note di Sviluppo

- **Framework**: p5.js v1.0.0
- **Compatibilità**: Tutti i browser moderni
- **Risoluzione**: 882x562 pixel
- **FPS**: 8 frame per secondo per le animazioni

## 🎉 Divertiti a Giocare!

Questo è un progetto educativo che dimostra come implementare un gioco classico usando tecnologie web moderne. Sentiti libero di modificare e migliorare il codice!

---

*Sviluppato con ❤️ usando p5.js*
