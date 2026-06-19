import { BackgroundForm } from "../../Components/forms/background";
import { Body } from "../../Components/forms/body";

function Formulario(){
    return(
        <div>
            {/* Tag de abertura */}
            <BackgroundForm> 
                
                {/* O filho (que passará a ser renderizado dentro do BackgroundForm) */}
                <Body/> 
                
            {/* Tag de fechamento */}
            </BackgroundForm> 
        </div>
    )
}

export { Formulario }