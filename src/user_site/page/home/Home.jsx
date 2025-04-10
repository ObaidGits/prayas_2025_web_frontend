import './Home.css'
import React, { useEffect, useState } from 'react';
import SOSButton from './SOSButton';
import { useNavigate } from 'react-router-dom';
import { getUser, userLogout } from '../../../services/Apis';
import { toast } from 'react-toastify';

const Home = () => {
    useEffect(() => {
        $("#owl-intro-text").owlCarousel({
            loop: true,
            margin: 10,
            nav: true,
            autoplay: true,
            items: 1, // Adjust based on requirement
            dots: true,
        });
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const checkLoginStatus = async () => {
        try {
            const config = { 'Content-Type': 'multipart/form-data' };
            const response = await getUser({}, config);

            const user = response.data?.data;

            if (user && user._id) {
                setIsLoggedIn(true);
                setUser(user);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsLoggedIn(false);
            console.error("Error verifying login:", error);
        }
    };


    const userLogoutFunction = async () => {
        console.log("Logout button clicked");
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            };
            const res = await userLogout({}, config);
            console.log("Logout response:", res);
            if (res.status === 200) {
                toast.success(`${res.data.message}! Redirecting to login...`);
                navigate('/login');
            } else {
                toast.error(res.data?.message || "Logout failed");
            }
        } catch (error) {
            console.log("Logout error:", error);
            toast.error(error.response?.data?.message || "Logout failed. Please try again.");
        }
    };


    useEffect(() => {
        checkLoginStatus();
    }, []);

    return (
        <div data-spy="scroll" data-target="#main-navbar">
            {/* <div class="page-loader"></div> */}
            <header id="header" class="header-main">
                <nav id="main-navbar" class="navbar navbar-default navbar-fixed-top" role="navigation">
                    <div class="container">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>
                            <a class="navbar-brand page-scroll" href="/">STREESAFE</a>
                        </div>
                        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul class="nav navbar-nav navbar-right">
                                <li><a class="page-scroll" href="/">Home</a></li>
                                <li><a class="page-scroll" href="#about-section">About</a></li>
                                <li><a class="page-scroll" href="#services-section">Services</a></li>
                                <li><a class="page-scroll" href="#portfolio-section">Works</a></li>
                                {/* <li><a class="page-scroll" href="#team-section">Team</a></li> */}
                                <li><a class="page-scroll" href="#contact-section">Contact</a></li>
                                {isLoggedIn ? (
                                    <li><a class="page-scroll" onClick={userLogoutFunction}>Logout</a></li>
                                ) : (
                                    <>
                                        <li><a class="page-scroll" href="/login">Login</a></li>
                                        <li><a class="page-scroll" href="/signup">Signup</a></li>
                                    </>
                                )}

                                <li><a class="page-scroll" href="/admin/home">Admin</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            <section id="text-carousel-intro-section" className="parallax" data-stellar-background-ratio="0.5" style={{ backgroundImage: "url('img/wp.jpg')" }} >
                <div className="container">
                    <div className="caption text-center text-white" data-stellar-ratio="0.7">
                        <div id="owl-intro-text" className="owl-carousel">
                            <div className="item">
                                <h1>STREESAFE</h1>
                                <p>Let's make the web beautiful together</p>
                                <div className="extra-space-l"></div>
                                <a className="btn btn-blank" href="" target="_blank" rel="noopener noreferrer">
                                    View More!
                                </a>
                            </div>
                            <div className="item">
                                <h1>Join with us</h1>
                                <p>To the greatest Journey</p>
                                <div className="extra-space-l"></div>
                                <a className="btn btn-blank" href="" target="_blank" rel="noopener noreferrer">
                                    View More!
                                </a>
                            </div>
                            <div className="item">
                                <h1>I'm STREE</h1>
                                <p>One Page Responsive Theme</p>
                                <div className="extra-space-l"></div>
                                <a className="btn btn-blank" href="" target="_blank" rel="noopener noreferrer">
                                    View More!
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about-section" class="page bg-style1">
                {/* <!-- Begin page header--> */}
                <div class="page-header-wrapper">
                    <div class="container">
                        <div class="page-header text-center wow fadeInUp" data-wow-delay="0.3s">
                            <h2>About</h2>
                            <div class="devider"></div>
                            <p class="subtitle">little information</p>
                        </div>
                    </div>
                </div>
                {/* <!-- End page header--> */}

                {/* <!-- Begin rotate box-1 --> */}
                <div class="rotate-box-1-wrapper">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-3 col-sm-6">
                                <a href="#" class="rotate-box-1 square-icon wow zoomIn" data-wow-delay="0">
                                    <span class="rotate-box-icon"><i class="fa fa-users"></i></span>
                                    <div class="rotate-box-info">
                                        <h4>Who We Are?</h4>
                                        <p>A Provider of Safety </p>
                                    </div>
                                </a>
                            </div>

                            <div class="col-md-3 col-sm-6">
                                <a href="#" class="rotate-box-1 square-icon wow zoomIn" data-wow-delay="0.2s">
                                    <span class="rotate-box-icon"><i class="fa fa-diamond"></i></span>
                                    <div class="rotate-box-info">
                                        <h4>What We Do?</h4>
                                        <p>Shapping cities where every women is safe</p>
                                    </div>
                                </a>
                            </div>

                            <div class="col-md-3 col-sm-6">
                                <a href="#" class="rotate-box-1 square-icon wow zoomIn" data-wow-delay="0.4s">
                                    <span class="rotate-box-icon"><i class="fa fa-heart"></i></span>
                                    <div class="rotate-box-info">
                                        <h4>Why We Do It?</h4>
                                        <p>Empowering Safety, Ensuring Protection </p>
                                    </div>
                                </a>
                            </div>

                            <div class="col-md-3 col-sm-6">
                                <a href="#" class="rotate-box-1 square-icon wow zoomIn" data-wow-delay="0.6s">
                                    <span class="rotate-box-icon"><i class="fa fa-clock-o"></i></span>
                                    <div class="rotate-box-info">
                                        <h4>What Is Name?</h4>
                                        <p>Focuses on Advanced CCTV surveillance </p>
                                    </div>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="extra-space-l"></div>
                <div class="page-header-wrapper">
                    <div class="container">
                        <div class="page-header text-center wow fadeInUp" data-wow-delay="0.3s">
                            <h4>Our Skills</h4>
                        </div>
                    </div>
                </div>

                <div class="our-skills">
                    <div class="container">
                        <div class="row">

                            <div class="col-sm-6">
                                <div class="skill-bar wow slideInLeft" data-wow-delay="0.2s">
                                    <div class="progress-lebel">
                                        <h6>AI Integration</h6>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style={{ width: "75%" }}>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="skill-bar wow slideInRight" data-wow-delay="0.2s">
                                    <div class="progress-lebel">
                                        <h6>SOS</h6>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style={{ width: "85%" }}>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="skill-bar wow slideInLeft" data-wow-delay="0.4s">
                                    <div class="progress-lebel">
                                        <h6>CCTV surveillance</h6>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" aria-valuenow="95" aria-valuemin="0" aria-valuemax="100" style={{ width: "95%" }}>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="skill-bar wow slideInRight" data-wow-delay="0.4s">
                                    <div class="progress-lebel">
                                        <h6>Thread Detection</h6>
                                    </div>
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style={{ width: "70%" }}>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section id="services-section" class="page text-center">
                <div class="page-header-wrapper">
                    <div class="container">
                        <div class="page-header text-center wow fadeInDown" data-wow-delay="0.4s">
                            <h2>Services</h2>
                            <div class="devider"></div>
                            <p class="subtitle">what we really know how</p>
                        </div>
                    </div>
                </div>

                <div class="rotate-box-2-wrapper">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-3 col-sm-6">
                                <a href="#" class="rotate-box-2 square-icon text-center wow zoomIn" data-wow-delay="0">
                                    <span class="rotate-box-icon"><i class="fa fa-mobile"></i></span>
                                    <div class="rotate-box-info">
                                        <h4>CCTV surveillance</h4>
                                        <p>It focuses on an advanced CCTV surveillance system designed to detect crimes against women and immediately notify the nearest police station.</p>
                                    </div>
                                </a>
                            </div>

                            <div class="col-md-3 col-sm-6">
                                <a href="#" class="rotate-box-2 square-icon text-center wow zoomIn" data-wow-delay="0.2s">
                                    <span class="rotate-box-icon"><i class="fa fa-pie-chart"></i></span>
                                    <div class="rotate-box-info">
                                        <h4>Emergency Contacts</h4>
                                        <p>In case of danger, instantly connect with trusted contacts and authorities, the application will send your live location directly to nearestpolice station. Stay Safe with real time alert and quick assitance</p>
                                    </div>
                                </a>
                            </div>

                            <div class="col-md-3 col-sm-6">
                                <a href="#" class="rotate-box-2 square-icon text-center wow zoomIn" data-wow-delay="0.4s">
                                    <span class="rotate-box-icon"><i class="fa fa-cloud"></i></span>
                                    <div class="rotate-box-info">
                                        <h4>SOS</h4>
                                        <p>Some warning sounds like help or danger said by the user, the SOS features get activated,while sharing the location to the nearby police station with one gesture for immediate help</p>
                                    </div>
                                </a>
                            </div>

                            <div class="col-md-3 col-sm-6">
                                <a href="#" class="rotate-box-2 square-icon text-center wow zoomIn" data-wow-delay="0.6s">
                                    <span class="rotate-box-icon"><i class="fa fa-pencil"></i></span>
                                    <div class="rotate-box-info">
                                        <h4>Safest Route</h4>
                                        <p>Using AI to analyze past incidents and predict unsafe zones and navigate confidently with AI-powered route suggestions that prioritize security. Avoid high-risk areas and reach your destination safely.</p>
                                    </div>
                                </a>
                            </div>

                        </div>
                    </div>

                    <div class="container">
                        <div class="extra-space-l"></div>
                        <div class="text-center">
                            <a class="btn btn-default btn-lg-xl" href="https://www.flipkart.com/womens-safety/pr?sid=hlc,iwt" target="_blank" role="button">Shop Safety Essentials</a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="testimonial-section">
                <div id="testimonial-trigger" class="testimonial text-white parallax" data-stellar-background-ratio="0.5" style={{ backgroundImage: "url('img/testimonial-bg.jpg')" }}>
                    <div class="cover"></div>

                    <div class="page-header-wrapper">
                        <div class="container">
                            <div class="page-header text-center wow fadeInDown" data-wow-delay="0.4s">
                                <h2>Reviews</h2>
                                <div class="devider"></div>
                                <p class="subtitle">What people say about us</p>
                            </div>
                        </div>
                    </div>

                    <div class="container">
                        <div class="testimonial-inner center-block text-center">
                            <div id="owl-testimonial" class="owl-carousel">
                                <div class="item">
                                    <blockquote>
                                        <p>STREESAFE is an excellent platform that leverages technology to ensure women's security. It is an outstanding step toward enhancing women's safety.</p>
                                        <footer><cite title="Source Title">Charlotte</cite></footer>
                                    </blockquote>
                                </div>
                                <div class="item">
                                    <blockquote>
                                        <p>The idea of using CCTV and machine learning to detect threats is brilliant. Stree Safe is simple to use yet powerful in its purpose. The website is smooth and efficient, making safety more accessible for everyone</p>
                                        <footer><cite title="Source Title">Rosolia</cite></footer>
                                    </blockquote>
                                </div>
                                <div class="item">
                                    <blockquote>
                                        <p>In today's world, ensuring women's safety is of utmost importance, and Stree Safe does an incredible job of addressing this issue. The platform is intuitive, and the technology behind it is impressive. A big thumbs up to the creators!</p>
                                        <footer><cite title="Source Title">Geogrina</cite></footer>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="portfolio-section" class="page bg-style1">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="portfolio">

                                <div class="page-header-wrapper">
                                    <div class="container">
                                        <div class="page-header text-center wow fadeInDown" data-wow-delay="0.4s">
                                            <h2>Our Works</h2>
                                            <div class="devider"></div>
                                            <p class="subtitle">What we are proud of</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="portfoloi_content_area" >
                                    <div class="portfolio_menu" id="filters">
                                        <ul>
                                            <li class="active_prot_menu"><a href="#porfolio_menu" data-filter="*">all</a></li>

                                        </ul>
                                    </div>
                                    <div class="portfolio_content">
                                        <div class="row" id="portfolio">
                                            <div class="col-xs-12 col-sm-4 appsDevelopment">
                                                <div class="portfolio_single_content">
                                                    <img src="img/portfolio/p1.jpg" alt="title" />
                                                    <div>
                                                        <a href="#">AI Shield</a>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-sm-4 GraphicDesign">
                                                <div class="portfolio_single_content">
                                                    <img src="img/resized_image (1).jpeg" alt="title" />
                                                    <div>
                                                        <a href="#">Women Safety</a>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-sm-4 responsive">
                                                <div class="portfolio_single_content">
                                                    <img src="img/resized_image2.jpeg" alt="title" />
                                                    <div>
                                                        <a href="#">CCTV surveillance</a>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-sm-4 webDesign websites">
                                                <div class="portfolio_single_content">
                                                    <img src="img/ex.jpeg" alt="title" />
                                                    <div>
                                                        <a href="#">Emergency SOS</a>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-sm-4 appsDevelopment websites">
                                                <div class="portfolio_single_content">
                                                    <img src="img/resized_image_600x600.jpeg" alt="title" />
                                                    <div>
                                                        <a href="#">Threat Detection</a>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-sm-4 GraphicDesign">
                                                <div class="portfolio_single_content">
                                                    <img src="img/resized_image (2).jpeg" alt="title" />
                                                    <div>
                                                        <a href="#">SafeSignal</a>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-sm-4 responsive">
                                                <div class="portfolio_single_content">
                                                    <img src="img/resized_image_2.jpeg" alt="title" />
                                                    <div>
                                                        <a href="#">Stronger together</a>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-sm-4 GraphicDesign">
                                                <div class="portfolio_single_content">
                                                    <img src="img/resized_image (1) (2).jpeg" alt="title" />
                                                    <div>
                                                        <a href="#">Safe Streets</a>

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-12 col-sm-4 websites">
                                                <div class="portfolio_single_content">
                                                    <img src="img/resized_women_safety.jpeg" alt="title" />
                                                    <div>
                                                        <a href="#">Fearless Women</a>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="counter-section">
                <div id="counter-up-trigger" class="counter-up text-white parallax" data-stellar-background-ratio="0.5" style={{ backgroundImage: "url('img/counter-bg.jpg')" }}>
                    <div class="cover"></div>

                    <div class="page-header-wrapper">
                        <div class="container">
                            <div class="page-header text-center wow fadeInDown" data-wow-delay="0.4s">

                            </div>
                        </div>
                    </div>

                    <div class="container">

                        <div class="row">

                            <div class="fact text-center col-md-3 col-sm-6">
                                <div class="fact-inner">
                                    <i class="fa fa-female fa-5x"></i>
                                    <div class="extra-space-l"></div>

                                </div>
                            </div>

                            <div class="fact text-center col-md-3 col-sm-6">
                                <div class="fact-inner">
                                    <i class="fa fa-mobile fa-5x"></i>
                                    <div class="extra-space-l"></div>

                                </div>
                            </div>

                            <div class="fact text-center col-md-3 col-sm-6">
                                <div class="fact-inner">
                                    <i class="fa fa-map-marker fa-5x"></i>
                                    <div class="extra-space-l"></div>

                                </div>
                            </div>

                            <div class="fact last text-center col-md-3 col-sm-6">
                                <div class="fact-inner">
                                    <i class="fa fa-phone fa-5x"></i>
                                    <div class="extra-space-l"></div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section id="team-section" class="page">

                <div class="page-header-wrapper">
                    <div class="container">
                        <div class="page-header text-center wow fadeInDown" data-wow-delay="0.4s">
                            <h2>Our Team</h2>
                            <div class="devider"></div>
                            <p class="subtitle">Meat our experts</p>
                        </div>
                    </div>
                </div>

                <div class="container">
                    <div class="row">
                        <div class="team-items">
                            <div class="col-md-2">
                                <div class="team-container wow bounceIn" data-wow-delay="0.2s">
                                    <div class="team-item">
                                        <div class="team-triangle">
                                            <div class="content">
                                                <img src="img/team/WhatsApp Image 2025-04-03 at 2.37.02 PM.jpg" alt="title" />
                                                <div class="team-hover text-center">
                                                    <i class="fa fa-male"></i>
                                                    <p>Obaidullah Zeeshan</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="team-container wow bounceIn" data-wow-delay="0.3s">
                                    <div class="team-item">
                                        <div class="team-triangle">
                                            <div class="content">
                                                <img src="img/team/WhatsApp Image 2025-04-03 at 2.37.02 PM.jpg" alt="title" />
                                                <div class="team-hover text-center">
                                                    <i class="fa fa-female"></i>
                                                    <p>Aayushi Kaushik</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="team-container wow bounceIn" data-wow-delay="0.4s">
                                    <div class="team-item">
                                        <div class="team-triangle">
                                            <div class="content">
                                                <img src="img/team/WhatsApp Image 2025-04-03 at 2.37.02 PM.jpg" alt="title" />
                                                <div class="team-hover text-center">
                                                    <i class="fa fa-male"></i>
                                                    <p>Imran Alam</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-2">
                                <div class="team-container wow bounceIn" data-wow-delay="0.5s">
                                    <div class="team-item">
                                        <div class="team-triangle">
                                            <div class="content">
                                                <img src="img/team/WhatsApp Image 2025-04-03 at 2.37.02 PM.jpg" alt="title" />
                                                <div class="team-hover text-center">
                                                    <i class="fa fa-female"></i>
                                                    <p>Navanya Sinha</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="team-container wow bounceIn" data-wow-delay="0.6s">
                                    <div class="team-item">
                                        <div class="team-triangle">
                                            <div class="content">
                                                <img src="img/team/WhatsApp Image 2025-04-03 at 2.46.46 PM.jpg" alt="title" />
                                                <div class="team-hover text-center">
                                                    <i class="fa fa-male"></i>
                                                    <p>Faizan Ahmed</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="team-container wow bounceIn" data-wow-delay="0.7s">
                                    <div class="team-item">
                                        <div class="team-triangle">
                                            <div class="content">
                                                <img src="img/team/WhatsApp Image 2025-04-03 at 2.46.46 PM.jpg" alt="title" />
                                                <div class="team-hover text-center">
                                                    <i class="fa fa-female"></i>
                                                    <p>Rajeswari Mohapatra</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="team-container wow bounceIn" data-wow-delay="0.8s">
                                    <div class="team-item">
                                        <div class="team-triangle">
                                            <div class="content">
                                                <img src="img/team/WhatsApp Image 2025-04-03 at 2.46.46 PM.jpg" alt="title" />
                                                <div class="team-hover text-center">
                                                    <i class="fa fa-female"></i>
                                                    <p>StreeSafe-</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                    </div>
                </div>

            </section>

            <div class="extra-space-l"></div>


            <section id="contact-section" class="page text-white parallax" data-stellar-background-ratio="0.5" style={{ backgroundImage: "url('img/map-bg.jpg')" }}>
                <div class="cover"></div>

                <div class="page-header-wrapper">
                    <div class="container">
                        <div class="page-header text-center wow fadeInDown" data-wow-delay="0.4s">
                            <h2>Contacts</h2>
                            <div class="devider"></div>
                            <p class="subtitle">All to contact us</p>
                        </div>
                    </div>
                </div>

                <div class="contact wow bounceInRight" data-wow-delay="0.4s">
                    <div class="container">
                        <div class="row">

                            <div class="col-sm-6">
                                <div class="contact-info">
                                    <h4>Our Address</h4>
                                    <ul class="contact-address">
                                        <li><i class="fa fa-map-marker fa-lg"></i>&nbsp;A-12, Connaught Place,  <br /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; New Delhi<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 110001, India</li>
                                        <li><i class="fa fa-phone"></i>&nbsp; +91XXXXXXXXX</li>
                                        <li><i class="fa fa-print"></i>&nbsp; +91XXXXXXXXX</li>
                                        <li><i class="fa fa-envelope"></i> info@StreeSafe-.com</li>
                                        <li><i class="fa fa-skype"></i> STREESAFE</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="col-sm-6">
                                <div class="contact-form">
                                    <h4>Write to us</h4>
                                    <form role="form">
                                        <div class="form-group">
                                            <input type="text" class="form-control input-lg" placeholder="Your Name" required />
                                        </div>
                                        <div class="form-group">
                                            <input type="email" class="form-control input-lg" placeholder="E-mail" required />
                                        </div>
                                        <div class="form-group">
                                            <input type="text" class="form-control input-lg" placeholder="Subject" required />
                                        </div>
                                        <div class="form-group">
                                            <textarea class="form-control input-lg" rows="5" placeholder="Message" required></textarea>
                                        </div>
                                        <button type="submit" class="btn wow bounceInRight" data-wow-delay="0.8s">Send</button>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <footer class="text-off-white">

                <div class="footer-top">
                    <div class="container">
                        <div class="row wow bounceInLeft" data-wow-delay="0.4s">

                            <div class="col-sm-6 col-md-4">
                                <h4>Useful Links</h4>
                                <ul class="imp-links">
                                    <li><a href="">About</a></li>
                                    <li><a href="">Services</a></li>
                                    <li><a href="">Press</a></li>
                                    <li><a href="">Copyright</a></li>
                                    <li><a href="">Advertise</a></li>
                                    <li><a href="">Legal</a></li>
                                </ul>
                            </div>

                            <div class="col-sm-6 col-md-4">
                                <h4>LOGIN</h4>
                                <div id="footer_signup">
                                    <div id="email">
                                        <form id="subscribe" method="POST">
                                            <input type="text" placeholder="Enter email address" name="email" id="address" data-validate="validate(required, email)" />
                                            <button type="submit">Submit</button>
                                            <span id="result" class="section-description"></span>
                                        </form>
                                    </div>
                                </div>
                                <p>This technology enhances public safety by providing proactive crime prevention and real-time intervention, making urban spaces safer for women.</p>
                            </div>

                            <div class="col-sm-12 col-md-4">
                                <h4>Recent Tweets</h4>
                                <div class="single-tweet">
                                    <div class="tweet-content"><span>@StreeSafe</span>"Introducing #StreeSafe - AI-powered safety for women! 🚨 Live tracking, CCTV surveillance & instant SOS. Because safety is a right, not a privilege. Stay protected! 🔒 #WomenSafety #AIForGood"</div>
                                    <div class="tweet-date">3 Hour ago</div>
                                </div>
                                <div class="single-tweet">
                                    <div class="tweet-content"><span>@StreeSafe</span>" Walking home alone? Stay safe with #StreeSafe! 🛡️ Real-time alerts, safest route suggestions & emergency contacts – all in one place. Try it today! 🚶‍♀️💙 #StaySafe #SecurityFirst"</div>
                                    <div class="tweet-date">1 Hour ago</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="footer">
                    <div class="container text-center wow fadeIn" data-wow-delay="0.4s">
                        <p class="copyright">Copyright &copy; 2025 - Designed By <a href="https://www.behance.net/poljakova" class="theme-author">StreeSafe</a> &amp; Developed by <a href="http://www.imransdesign.com/" class="theme-author">StreeSafe</a></p>
                    </div>
                </div>

            </footer>
            <SOSButton />
            <a href="#" class="scrolltotop"><i class="fa fa-arrow-up"></i></a>
        </div>
    )
}

export default Home