// import { AuthProvider } from '@redwoodjs/auth'
// import { initializeApp } from 'firebase/app'
// import * as firebaseAuth from '@firebase/auth'
// import { getAuth } from 'firebase/auth'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { SnackbarProvider } from 'notistack'
import { Provider as ReduxProvider } from 'react-redux'
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import AuthProvider from 'src/context/firebase-auth-context'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'
import store from 'src/state/store'

import './index.css'
import { Toaster } from 'react-hot-toast'

// const firebaseConfig = {
//   // apiKey: process.env.FIREBASE_API_KEY,
//   // authDomain: process.env.FIREBASE_AUTH_DOMAIN,

//   apiKey: 'AIzaSyDlr5xlq378B5vyetXvE_rK1r4EhPhFTt4',
//   authDomain: 'redefine-erp.firebaseapp.com',

//   /** Optional config, may be needed, depending on how you use firebase
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   **/
// }

// const app = initializeApp(firebaseConfig)
// const auth = getAuth()

// const firebaseApp = ((config) => {
//   const apps = getApps()
//   if (!apps.length) {
//     initializeApp(config)
//   }
//   return getApp()
// })(firebaseConfig)
// export const admin1 = admin
//   .auth()
//   .setCustomUserClaims('0HkJo6v6zeMeIH5DEPqjiHvwL2z2', { admin: true })
// export const firebaseClient = {
//   firebaseAuth,
//   auth,
//   app, // optional
// }
const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <ReduxProvider store={store}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={3000}
          maxSnack={3}
        >
          <AuthProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Routes />
              {/* <Toaster
              autoClose={10000} 
              position="top-right"
                
              /> */}

              <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  className: '',
                  duration: 5000,
                  removeDelay: 1000,

                  // @ts-ignore
                  warning: {
                    duration: 3000,
                    iconTheme: {
                      primary: 'yellow',
                      secondary: 'black',
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ReduxProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
