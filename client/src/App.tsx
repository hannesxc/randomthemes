import { useState } from 'react';
import './App.css';

interface CSInterface {
  evalScript(script: string, callback?: (result?: any) => void): void;
}

declare global {
  interface window {
    CSInterface: CSInterface;
  }
}

function App() {
  const [palette, setPalette] = useState<number[][]>(Array(5).fill([255, 255, 255]));
  const [ext, setExt] = useState<string>('ai');
  const [showCode, setShowCode] = useState<boolean>(false);
  const [color, setColor] = useState<number[]>([255, 255, 255]);
  const themes: string[] = ["Black & White", "Aesthetic", "Vintage", "Minimalistic", "Futuristic", "Abstract", "Playful"];

  const CSI: CSInterface = new (window as any).CSInterface();

  // Fill an array with 3 random values b/w [0, 255]
  const randomizeColors = (): number[] => {
    const randomValues: number[] = Array(3).fill(null).map(() => {
      return Math.floor(Math.random() * 256);
    });
    return randomValues;
  };

  // Fill palette with 5 random RGB colors
  const randomizePalette = (): void => {
    setPalette(palette.map(() => {
      return randomizeColors();
    }));
  };

  // Random theme - get random idx in arr, send current theme, current color selected and opacity ranging in [20, 90]
  const randomizeTheme = (): void => {
    const randIndex: number = Math.floor(Math.random() * themes.length);

    const themeObj: string = JSON.stringify({
      theme: themes[randIndex],
      opacity: (randIndex + 2) * 10,
      r: color[0], g: color[1], b: color[2]
    });

    CSI.evalScript(`applyTheme(${themeObj})`);
  };

  // Set an active color palette on click
  const colorDoc = (rgb: number[]): void => {
    setColor(rgb);
    CSI.evalScript(`colorDoc([${rgb}])`);
  };

  // Toggle RGB/HSL/Theme text 
  const handleText = (show: boolean): void => {
    setShowCode(!showCode);
    CSI.evalScript(`showText(${show})`);
  };

  // Export doc as ai, jpeg or png
  const saveFile = (): void => {
    CSI.evalScript(`saveFile("${ext}")`);
  };

  return (
    <div className='mainDiv'>
      <div className='contents'>
        <h1>Generate Random Themes</h1>
        <div className='buttons'>
          <button type='button' onClick={randomizePalette}>Random Palette</button>
          <button type='button' onClick={randomizeTheme}>Random Theme</button>
        </div>
        <div className='palette'>
          {palette.map((color, idx) => {
            const rgb = `rgb(${color})`;
            return <div key={idx} className='bar' style={{ backgroundColor: rgb }} onClick={() => colorDoc(color)} title={rgb} />;
          })}
        </div>
        <label className='text'>
          <input type='checkbox' checked={showCode} onChange={() => handleText(!showCode)} />
          <p>Show Theme Values</p>
        </label>
        <p>Tip: Hover over the palette to get the RGB code, or click on one to apply!</p>
        <div className='buttons'>
          <button type='button'>
            File Type:
            <select defaultValue='ai' onChange={(e) => setExt(e.target.value)}>
              <option value='ai'>AI</option>
              <option value='jpg'>JPEG</option>
              <option value='png'>PNG</option>
            </select>
          </button>
          <button type='button' onClick={saveFile}>Export</button>
          <button type='button' onClick={() => location.reload()}>Refresh</button>
        </div>
      </div>
    </div>
  );
}

export default App;
