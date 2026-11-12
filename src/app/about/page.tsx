import "./about.css";
import "./about-shell.css";

import { AboutRoot } from "@/components/about/interactive/AboutRoot";
import AboutHero from "@/components/about/AboutHero";
import AboutNav from "@/components/about/AboutNav";
import AboutSkills from "@/components/about/AboutSkills";
import AboutProjects from "@/components/about/AboutProjects";
import AboutSolutions from "@/components/about/AboutSolutions";
import AboutProcess from "@/components/about/AboutProcess";
import AboutJourney from "@/components/about/AboutJourney";
import AboutCourses from "@/components/about/AboutCourses";
import AboutTopics from "@/components/about/AboutTopics";
import AboutQuotes from "@/components/about/AboutQuotes";
import AboutContact from "@/components/about/AboutContact";

/* Trang Giới thiệu v4 "Neural Studio" — dựng theo MCP aihoclaptrinh-design.
   Chủ đề tối đi theo .dark trên <html> của app (about.css đã map sẵn),
   nên không truyền prop dark cho AboutRoot. */
export default function AboutPage() {
  return (
    <div className="abt-shell-reset">
      <AboutRoot>
        <AboutHero />
        <AboutNav />
        <AboutSkills />
        <AboutProjects />
        <AboutSolutions />
        <AboutProcess />
        <AboutJourney />
        <AboutCourses />
        <AboutTopics />
        <AboutQuotes />
        <AboutContact />
      </AboutRoot>
    </div>
  );
}
