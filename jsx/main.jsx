// Create document of width - 1200px and height - 900px, specify RGB format

var doc = app.documents.add(DocumentColorSpace.RGB, 1200, 900);
var layer = doc.layers[0];
layer.name = "Color Layer";
var showCode = false;
var text1 = [[255, 255, 255], ["0deg", "0%", "100%"]];
var colorText = doc.textFrames.pointText([50, doc.height - 50]);
var themeText = doc.textFrames.pointText([50, doc.height - 100]);
var themeText2 = doc.textFrames.pointText([50, doc.height - 150]);
applyTextStyle(colorText);
applyTextStyle(themeText);
applyTextStyle(themeText2);


// Export file to Downloads folder

function saveFile(ext) {
  var downloadsFolder = new Folder("~/Downloads");     // grab user/downloads folder
  var timestamp = new Date().getTime().toString();     // generate unique timestamp
  var file = downloadsFolder + '/output_' + timestamp;

  if (ext === 'ai') {
    exportFileToAI(file)
  } else if (ext === 'jpg') {
    exportFileToJPG(file)
  } else if (ext === 'png') {
    exportFileToPNG24(file)
  }

  alert('Exported to ' + file + '.' + ext + ' !');
}


// Apply random color palette to document

function colorDoc(rgb) {
  layer = doc.layers[0];
  var rect = getItemByName("Color Rect");

  // Check if rectItem exists, else create rect for whole artboard and instantiate RGBColor
  if (!rect) {
    rect = layer.pathItems.rectangle(doc.height, 0, doc.width, doc.height);
    rect.name = "Color Rect";
  }

  var fillColor = new RGBColor();

  fillColor.red = parseInt(rgb[0]);
  fillColor.green = parseInt(rgb[1]);
  fillColor.blue = parseInt(rgb[2]);
  rect.fillColor = fillColor;

  // For color text
  text1[0] = rgb;
  var con = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  text1[1] = [con.h + "deg", con.s + "%", con.l + "%"];

  if (showCode) {
    showText(true)
  }
}


// Show Color/Theme codes

function showText(show) {
  // Check if text layer exists, else create one
  layer = getLayerByName("Text Layer");
  
  if (!layer) {
    layer = doc.layers.add()
    layer.name = "Text Layer"
  }

  if (show) {
    // Modify the textframes
    showCode = true;
    colorText.contents = "Original RGB: " + text1[0].join(", ") + "    Original HSL: " + text1[1].join(", ");
    colorText.move(layer, ElementPlacement.PLACEATBEGINNING);

    if (text1.length > 2) {
      themeText.contents = "Current Theme: " + text1[4][0] + "    Opacity: " + text1[4][1];
      themeText2.contents = "Modified RGB: " + text1[2].join(", ") + "   Modified HSL: " + text1[3].join(", ");
      themeText.move(layer, ElementPlacement.PLACEATBEGINNING);
      themeText2.move(layer, ElementPlacement.PLACEATBEGINNING);
    }
  } else {
    // Clear the textframes
    showCode = false;
    colorText.contents = "";
    themeText.contents = "";
    themeText2.contents = "";
  }
}

// Apply random theme to document

function applyTheme(props) {
  // Make sure initial rect item exists
  var item = getItemByName("Color Rect");
  if (!item) {
    alert("Choose a color palette first.");
    return;
  }

  // Check if second layer exits, else create one
  var theme = getLayerByName("Theme Layer");
  if (theme) {
    layer = theme;
  } else {
    layer = doc.layers.add();
    layer.name = "Theme Layer";
  }

  // Convert current RGB color to HSL, distort it, convert HSL to RGB again
  var hsl = rgbToHsl(props.r, props.g, props.b);
  var convertedHsl = distortColor(hsl, props.theme);
  var rgb = hslToRgb(convertedHsl.h, convertedHsl.s, convertedHsl.l);

  // Check if rectItem exists, else create rect for whole artboard and instantiate RGBColor
  var rect = getItemByName("Theme Rect");

  if (!rect) {
    rect = layer.pathItems.rectangle(doc.height, 0, doc.width, doc.height);
    rect.name = "Theme Rect";
  }

  var fillColor = new RGBColor();

  fillColor.red = rgb.r;
  fillColor.green = rgb.g;
  fillColor.blue = rgb.b;
  rect.fillColor = fillColor;
  rect.opacity = props.opacity;

  // For theme text
  if (text1.length > 2) {
    text1[2] = [rgb.r, rgb.g, rgb.b];
    text1[3] = [convertedHsl.h + "deg", convertedHsl.s + "%", convertedHsl.l + "%"];
    text1[4] = [props.theme, props.opacity + "%"]
  } else {
    text1.push([rgb.r, rgb.g, rgb.b], [convertedHsl.h + "deg", convertedHsl.s + "%", convertedHsl.l + "%"], [props.theme, props.opacity]);
  }

  if (showCode) {
    showText(true)
  }
}


// Check if layer exists

function getLayerByName(layerName) {
  for (var i = 0; i < doc.layers.length; i++) {
    var diffLayer = doc.layers[i];
    if (diffLayer.name === layerName)
      return diffLayer;
  }
  return null;
}


// Check if pathItem exists

function getItemByName(itemName) {
  for (var i = 0; i < doc.pathItems.length; i++) {
    var diffItem = doc.pathItems[i];
    if (diffItem.name === itemName)
      return diffItem;
  }
  return null;
}


// Modify Hue, Saturation and Lighting

function distortColor(hsl, theme) {
  if (theme === 'Black & White') {
    return { h: (hsl.h - 50 + 360) % 360, s: 10, l: 10 };
  }
  else if (theme === 'Vintage') {
    return { h: (hsl.h - 20 + 360) % 360, s: 20, l: 30 };
  }
  else if (theme === 'Futuristic') {
    return { h: (hsl.h + 180 + 360) % 360, s: 70, l: 20 };
  }
  else if (theme === 'Minimalistic') {
    return { h: (hsl.h - 50 + 360) % 360, s: 10, l: 60 };
  }
  else if (theme === 'Abstract') {
    return { h: (hsl.h + 40 + 360) % 360, s: 80, l: 60 };
  }
  else if (theme === 'Playful') {
    return { h: (hsl.h + 120 + 360) % 360, s: 90, l: 80 };
  }
  else if (theme === 'Aesthetic') {
    return { h: 20, s: 20, l: 10 };
  }
}


// Apply text styles to ranges

function applyTextStyle(textObj) {
  textObj.textRange.characterAttributes.strokeWeight = 0.1;
  textObj.textRange.characterAttributes.size = 25;
}


// Export options for ai, jpg, png

function exportFileToPNG24(dest) {
  var exportOptions = new ExportOptionsPNG24();
  exportOptions.artBoardClipping = true; // export the whole artboard

  var type = ExportType.PNG24;
  var fileSpec = new File(dest);

  app.activeDocument.exportFile(fileSpec, type, exportOptions)
}

function exportFileToJPG(dest) {
  var exportOptions = new ExportOptionsJPEG();
  exportOptions.artBoardClipping = true; // export the whole artboard

  var type = ExportType.JPEG;
  var fileSpec = new File(dest);

  app.activeDocument.exportFile(fileSpec, type, exportOptions)
}

function exportFileToAI(dest) {
  var exportOptions = new IllustratorSaveOptions();
  exportOptions.artboardClipping = true; // export the whole artboard

  var fileSpec = new File(dest + '.ai');
  
  app.activeDocument.saveAs(fileSpec, exportOptions);
}


// input: h as an angle in [0, 360] and s,l in [0, 100] - output: r,g,b in [0, 255]

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  var r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}


// input: r, g, b in [0, 255], output: h in [0, 360] and s,l in [0, 100]

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }
  
  return { h: Math.round(360 * h), s: Math.round(100 * s), l: Math.round(100 * l) };
}

