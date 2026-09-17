import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import HighLightText from '../components/core/HomePage/HighLightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from '../assets/Images/banner.mp4';
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';
import Footer from '../components/common/Footer';

const Home = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex flex-col w-11/12 items-center max-w-maxContent text-white justify-between">
        <Link to={'/signup'}>
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95">
            <div className="flex items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        <div className="md:text-center text-4xl font-semibold mt-7">
          Empower Your Future with
          <HighLightText text={'Coding Skills'} />
        </div>

        <div className=" mt-4 md:w-[90%] md:text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex felx-row gap-7 mt-8">
          {/* Call to Action Button */}
          <CTAButton active={true} linkto={'/signup'}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={'/signup'}>
            Book Demo
          </CTAButton>
        </div>

        <div className="mx-3 my-12 shadow-[12px_12px_0px_0px_rgba(255,255,255)] ">
          <video
            className="shadow-[-15px_-15px_50px_rgba(8,_112,_184,_0.7)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* ! Code Section 1 */}
        <div className="">
          <CodeBlocks
            position={'sm:flex-row flex-col'}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your
                <HighLightText text={'Coding potential'} />
                with our online courses
              </div>
            }
            subheading={
              'Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.'
            }
            ctabtn1={{
              btnText: 'Try it Yourself',
              linkto: '/signup',
              active: true,
            }}
            ctabtn2={{
              btnText: 'Learn More',
              linkto: '/login',
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title><linkrel="stylesheet"href="styles\n.css">/head>\n<body>\n<h1><ahref="/">Header</a>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
            codeColor={'text-yellow-50'}
          />
        </div>

        {/* ! Code Section 2 */}
        <div>
          <CodeBlocks
            position={'sm:flex-row-reverse flex-col'}
            heading={
              <div className="text-4xl font-semibold ">
                Start
                <HighLightText text={'Coding in seconds'} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: 'Continue Lesson',
              linkto: '/signup',
              active: true,
            }}
            ctabtn2={{
              btnText: 'Learn More',
              linkto: '/login',
              active: false,
            }}
            codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title><linkrel="stylesheet"href="styles\n.css">/head>\n<body>\n<h1><ahref="/">Header</a>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n/nav>`}
            codeColor={'text-blue-25'}
          />
        </div>

        <ExploreMore />
      </div>

      {/* Section 2 */}
      <div className="bg-pure-greys-5 text-richblack-700  ">
        <div className="homepage_bg h-[310px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-center gap-5 mx-auto">
            <div className="h-[150px]"> </div>
            <div className="flex flex-row gap-7 text-white">
              <CTAButton active={true} linkto={'/signup'}>
                <div className="flex items-center gap-3">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={'/signup'}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-content flex flex-col items-center justify-between gap-7">
          <div className="flex md:flex-row flex-col gap-5 mb-10 mt-[95px]">
            <div className="text-4xl font-semibold md:w-[45%] md:pl-24">
              Get the Skills you need for a
              <HighLightText text={'Job that is in demand'} />
            </div>
            <div className="flex flex-col gap-10 md:w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={'/signup'}>
                Learn More
              </CTAButton>
            </div>
          </div>

          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* Section 3 */}
      <div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center justify-between gap-8 bg-richblack-900 text-white ">
        <InstructorSection />
        <h2 className="text-4xl text-center mt-10">
          Review from Other Learners
        </h2>
        {/* Review Section */}
      </div>
        <ReviewSlider />

      <Footer />
    </div>
  );
};

export default Home;
