import  {Slide} from "../../../../model/slide";
import { patchFieldApi } from './../../../../lib/patch-field';


export default patchFieldApi("slides", (slide: Slide, meta) =>  {
    if (typeof meta?.index !== "number") {
        throw new Error("index required")
    }   

    console.log(({
        $set: {
         [`slides.${meta.index}`]: slide
         }
     }))

    return  ({
       $set: {
        [`slides.${meta.index}`]: slide
        }
    })
})