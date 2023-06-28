# FRONTEND  
  
The frontend is bootstrapped by vite-react, and uses typescript and vanilla CSS for styling. You do have to rebuild the app everytime you want to see changes in your extension. Or you can just debug it in your browser through localhost:port by running dev. You won't be able to test any CSI functions though, they will error! 
  
## Installation  
  
Make sure you have node installed prior to executing these commands -  

> `npm install` to install the dependencies required  
  
> `npm run dev` to run/debug the frontend (NOT extendscript/CEP)  
  
> `npm run build` for build process and generating scripts which the extension relies on.  
  
  
Note: You do not have to restart your app/extension everytime you re-build your frontend - just click on `Refresh` button in the extension to reload the frontend. This doesn't mean you'll never have to restart your app - since any changes in CEP/Manifest/Extendscript will require you restarting your app or re-running the script.  