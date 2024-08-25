<!-- HeroMenu.js -->
<script type="text/babel">
  export function HeroMenu({ hero, onClose }) {
    const [speed, setSpeed] = React.useState(hero.speedY);
    const [color, setColor] = React.useState(hero.color);
    const [fireRate, setFireRate] = React.useState(hero.fireRate);

    const handleSpeedChange = (e) => {
      const newSpeed = Number(e.target.value);
      setSpeed(newSpeed);
      hero.speedY = newSpeed;
    };

    const handleColorChange = (e) => {
      const newColor = e.target.value;
      setColor(newColor);
      hero.color = newColor;
    };

    const handleFireRateChange = (e) => {
      const newFireRate = Number(e.target.value);
      setFireRate(newFireRate);
      hero.fireRate = newFireRate;
    };

    return (
      <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: '#fff' }}>
        <h3>Настройки Героя</h3>
        <label>
          Скорость передвижения:
          <input type="range" min="1" max="10" value={speed} onChange={handleSpeedChange} />
        </label>
        <br />
        <label>
          Цвет заклинаний:
          <input type="color" value={color} onChange={handleColorChange} />
        </label>
        <br />
        <label>
          Частота стрельбы:
          <input type="range" min="100" max="1000" value={fireRate} onChange={handleFireRateChange} />
        </label>
        <br />
        <button onClick={onClose}>Закрыть</button>
      </div>
    );
  }
</script>
