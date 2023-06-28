# Random Color/Theme Generator for Adobe Illustrator  
  
This is a 3rd party adobe illustrator plugin/extension which uses CEP & Extendscript under the hood to communicate with the host app. Frontend is bootstrapped with vite-react, uses typescript and vanilla CSS for styling.  
  
## Frontend  
  
Can be found inside the client folder. Do note the session folder - this is because CSInterface.js provided with CEP/Extendscript cannot be normally used with react or any other frontend library. You have to do a workaround/patch to expose the CSI package to the window's session object, after which you can instantiate CSI inside react for communication b/w your frontend and the host app (extendscript). 
  
Session folder and its code is NOT mine, I just got it somewhere and used it just so I could instantiate the CSI object.  
  
Client folder on the other hand, is mine. More information inside client/README.md.  
  
## Release  
  
Make sure you have node installed prior to executing this command -  
> `node createPackage.js`  
  
This should copy the essential assets required for the functioning of your extension to the com.adobe.randomtheme folder (such as CSXS, index.html, jsx, client/assets/CSInterface.js, index.js, main.css, .debug).  
  
## Installation  
  
You can either drag and drop this folder (if you wanna modify this app) or the com.adobe.randomtheme folder (if you just want to use the application) to this path inorder to get this extension working. Note, hierarchies are same, you don't need to modify anything -  
> `C:\Users\UserName\AppData\Roaming\Adobe\CEP\extensions`  
  
If you're using a signed package, you're fine. If not, and you're manually dropping the folders in your extensions directory, you have to enable debug mode in order to load unsigned extensions. Follow these steps:-  
  
> Search for regedit (REGISTRY EDITOR), ENTER  
> Go to HKEY_CURRENT_USER/SOFTWARE/ADOBE/CSXS.XX (XX stands for whatever version you have installed)  
> Right click on right side > New String Value  
> Specify name as PlayerDebugMode and data as 1  
  
Note: Location may change depending on your adobe version/product, if this doesn't work, find out your extensions folder through googling your adobe app version, and then putting the package there.  
  
## Debugging  
  
Check the .debug file. This is used for remote debugging your extension's frontend in a chromium browser. Launch the extension and go to localhost:8088 to debug the app. Do note, extendscript debugging is not possible here, you'd have to use ESTK or ESD tool by Adobe.  
  
## Development  
  
Manifest is inside CSXS, extendscript(js/jsx) files inside jsx and essential scripts inside client/assets. client/assets/session is only required during dev, not on release. Same as for index.html inside client/assets. It is useless. The main index.html the extension relies upon is the index.html in root folder.  