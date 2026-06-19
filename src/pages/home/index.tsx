import { Banner } from '../../Components';
import { About } from '../../Components';
import { Objectives } from '../../Components';
import { How_works } from '../../Components';
import { Footer } from '../../Components';

function Home() {
    return (
        <div>
            <Banner/>
            <About/>
            <How_works/>
            <Objectives/>
            <Footer/>
        </div>
    )
}

export { Home }