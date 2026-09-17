import React, { useState } from 'react';
import { HomePageExplore } from '../../../data/homepage-explore';
import HighLightText from './HighLightText';
import CourseCard from './CourseCard';

const tabNames = [
  'Free',
  'New to coding',
  'Most popular',
  'Skill paths',
  'Career paths',
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabNames[0]);
  const [hovered, setHovered] = useState(tabNames[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  const trans = {
    Free: 'translate-x-0 w-24',
    'New to coding': 'translate-x-24 w-44',
    'Most popular': 'translate-x-[17rem] w-[10.5rem]',
    'Skill paths': 'translate-x-[27.6rem] w-[143px]',
    'Career paths': 'translate-x-[36.6rem] w-[10.3rem]',
  };

  return (
    <div className="">
      <div className="text-4xl max-[460px]:w-1/2  mx-auto font-semibold text-center ">
        Unlock the
        <HighLightText text={'Power of Code'} />
      </div>
      <p className="text-center text-richblack-300 text-md mt-3">
        Learn to build anything you can imagine
      </p>

      <div className="flex scale-[0.5] mx-auto border md:scale-90 sm:scale-[0.8] lg:scale-100 flex-row rounded-full bg-richblack-800 w-fit mb-5 mt-5 relative p-1">
        {tabNames.map((element, index) => {
          return (
            <div
              className={`text-lg flex flex-row items-center  whitespace-nowrap gap-2 ${
                currentTab === element
                  ? 'text-richblack-5 border-b border-caribbeangreen-100  font-medium'
                  : 'text-richblack-200'
              } rounded-full cursor-pointer hover:text-richblack-5 px-7 py-2 z-20`}
              key={index}
              onClick={() => setMyCards(element)}
              onMouseEnter={() => {
                setHovered(element);
              }}
              onMouseLeave={() => {
                setHovered(currentTab);
              }}
            >
              {element}
            </div>
          );
        })}
        <div
          className={`absolute ${trans[hovered]} rounded-full transition-all duration-300  z-0 h-4/5 bg-richblack-900`}
        ></div>
      </div>

      <div className="md:h-[500px] min-[1206px]:h-[150px] h-[900px] mb-20">
        {/* Course card ka group */}
        <div className="flex w-fit md:flex-row flex-col flex-wrap gap-10 justify-center xl:justify-between mx-auto items-center ">
          {courses.map((element, index) => {
            return (
              <CourseCard
                key={index}
                cardData={element}
                currentCard={currentCard}
                setCurrentCard={setCurrentCard}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExploreMore;
