import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LuPackageCheck } from "react-icons/lu";
import { ImPriceTags } from "react-icons/im";
import { MdPriceCheck } from "react-icons/md";

import Logo1 from '../../assets/logo1.jpg';
import Logo2 from '../../assets/logo2.jpg';
import Logo3 from '../../assets/logo3.png';
import Logo4 from '../../assets/logo4.jpg';
import Logo5 from '../../assets/logo5.jpg';
import Logo6 from '../../assets/logo6.jpg';
import Logo7 from '../../assets/logo7.jpg';
import Logo8 from '../../assets/logo8.jpg';

const Sponsors = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
    };
    const className = "w-[100px] h-[100px] rounded-full"
    const classNameDivItems  = 'flex flex-row mt-3 mb-3'
    const classNameIcon = "text-white text-4xl bg-red-500 rounded-full w-[50px] h-[50px] p-2"
    const classNameText = "text-white font-bold mt-3 ml-4"
    return (
        <div className="sponsors-carousel mt-3 ">
            <h2 className='font-bold text-4xl text-center mt-9 mb-3'>Marcas con las que trabajamos</h2>
            <div className='border rounded-lg mr-3 ml-3 pt-3 pb-3'>
                <Slider {...settings}>
                    <div><img src={Logo1} alt="Logo 1" className={className} /></div>
                    <div><img src={Logo2} alt="Logo 2" className={className} /></div>
                    <div><img src={Logo3} alt="Logo 3" className={className} /></div>
                    <div><img src={Logo4} alt="Logo 4" className={className} /></div>
                    <div><img src={Logo5} alt="Logo 5" className={className} /></div>
                    <div><img src={Logo6} alt="Logo 6" className={className} /></div>
                    <div><img src={Logo7} alt="Logo 7" className={className} /></div>
                    <div><img src={Logo8} alt="Logo 8" className={className} /></div>
                </Slider>
            </div>
            <div className='flex flex-row bg-[#213547] gap-9 justify-center'>
             
                <div className={classNameDivItems}>
                    <LuPackageCheck className={classNameIcon}/>
                    <p className={classNameText}>Realizamos envíos a todo territorio Nacional</p>
                </div>
                <div className={classNameDivItems}>
                    <ImPriceTags className={classNameIcon}/>
                    <p className={classNameText}>Estamos pendientes a tus consultas!</p>
                </div>
                <div className={classNameDivItems}>
                    <MdPriceCheck className={classNameIcon}/>
                    <p className={classNameText}>Contamos con los mejores precios del mercado</p>
                </div>
               
            </div>
        </div>
    );
};

export default Sponsors;
