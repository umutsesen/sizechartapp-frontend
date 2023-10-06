import { useState } from 'react';
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/loadingAnimation.json";

const ActiveExtension = ({ domain, fetch, setExtensionModalActive, setIsExtensionActivated }) => {
  const [loading, setLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  console.log(domain, `3123`)

  const checkExtensionStatus = async () => {
    console.log("543345")
    setLoading(true)
    const getStatus = await fetch('/api/storeData/checkAppExtension');
    const cleanedStatus = await getStatus.json();
    console.log(cleanedStatus, `getStatus`)
    setLoading(false)
    if (cleanedStatus.isEmbedActive && cleanedStatus.isBlockActive) {
      setIsSuccessful(true)
      
      setTimeout(() => {
        setExtensionModalActive(false);
        setIsExtensionActivated(true)
      }, 3000);
    }
    console.log(cleanedStatus, `getStatus`)
  }
  return (
    <div className="activeExtensionModal">
      <div className="activeExtensionModal__content">
        {isSuccessful ? 
        <>
<div className="activeExtensionModal__content__title">Success</div>
<div className="activeExtensionModal__content__description">
  <p>You have successfully activated the Size&Me extension. This popup will be closed in three seconds.</p>
</div>
        </> : 
        
        
        <>
      
            <button onClick={() => setExtensionModalActive(false)} className="activeExtensionModal__content--close">X</button>

        
        <div className="activeExtensionModal__content__title">App Extensions Must Be Activated</div>
        <div className="activeExtensionModal__content__description">
          To use this app, you must activate the following extensions:
          <ul>
          <li>1. Click the first button and place the "Find My Size" button on your product page, click Save at the top right.</li>
          <li>2. Click the second button to activate the "Find My Size" extension, click Save at the top right.</li>
          <li>3. After you have completed both steps, click the "Refresh" button below.</li>

          </ul>
         

         
          <div className="activeExtensionModal__content__description__buttons">
            <a target="_blank" href={`https://${domain}/admin/themes/current/editor?template=product&addAppBlockId=48439803-bbff-41b3-9541-0d48b929ccda/app-block&target=mainSection
`} className="activeExtensionModal__content__description__buttons__button">Activate "Find My Size" Button</a>
            <a target="_blank"
             href={`https://${domain}/admin/themes/current/editor?context=apps&template=product&activateAppId=48439803-bbff-41b3-9541-0d48b929ccda/app-embed`} className="activeExtensionModal__content__description__buttons__button"
             >Activate "Find My Size" Extension</a>
          </div>
          {loading ?   <Lottie
          className="activeExtensionModal__loading"
          animationData={loadingAnimation}
          width="50px"
          height="50px"
         
          loop={true}
        /> : null}
          <div className="activeExtensionModal__content__description__button">
            <button onClick={checkExtensionStatus} className="activeExtensionModal__content__description__button__refresh">
              Refresh
          </button>
          </div>


        </div>
        </>}
        
      </div>
    </div>
  )
}

export default ActiveExtension;