import { Banner } from '../../Components';
import { About } from '../../Components';
import { Objectives } from '../../Components';
import { How_works } from '../../Components';
import { Footer } from '../../Components';
import { Interest } from '../../Components';

function Home() {
    return (
        <div>
            <Banner/>
            <About/>
            <How_works/>
            <Objectives/>
            <Interest/>
            <Footer/>
        </div>
    )
}

export { Home }