import React from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Briefcase, GraduationCap, Star } from 'lucide-react';

function Apps() {
  // Common styles object to avoid repetition
  const cardStyle = {
    background: '#0f172a', // Tailwind slate-900
    color: 'violet',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    padding: '1.5rem'
  };

  const iconStyle = {
    background: '#0f172a',
    color: '#ffffff',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  };

  return (
    <div className="bg-gray-50">
      <VerticalTimeline lineColor="#cbd5e1">
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={cardStyle}
          contentArrowStyle={{ borderRight: '7px solid #0f172a' }}
          date="2011 - present"
          iconStyle={iconStyle}
          icon={<Briefcase className="w-5 h-5" />}
        >
          <div className="font-sans">
            <h3 className="text-xl font-bold mb-1">Creative Director</h3>
            <h4 className="text-md opacity-90 mb-2">Miami, FL</h4>
            <p className="text-sm opacity-80 leading-relaxed">
              Creative Direction, User Experience, Visual Design, Project Management, Team Leading
            </p>
          </div>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={cardStyle}
          contentArrowStyle={{ borderRight: '7px solid #0f172a' }}
          date="2010 - 2011"
          iconStyle={iconStyle}
          icon={<GraduationCap className="w-5 h-5" />}
        >
          <div className="font-sans">
            <h3 className="text-xl font-bold mb-1">Art Director</h3>
            <h4 className="text-md opacity-90 mb-2">San Francisco, CA</h4>
            <p className="text-sm opacity-80 leading-relaxed">
              Creative Direction, User Experience, Visual Design, Project Management
            </p>
          </div>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={cardStyle}
          contentArrowStyle={{ borderRight: '7px solid #0f172a' }}
          date="2008 - 2010"
          iconStyle={iconStyle}
          icon={<Star className="w-5 h-5" />}
        >
          <div className="font-sans">
            <h3 className="text-xl font-bold mb-1">Web Designer</h3>
            <h4 className="text-md opacity-90 mb-2">Los Angeles, CA</h4>
            <p className="text-sm opacity-80 leading-relaxed">
              User Experience, Visual Design, Web Development
            </p>
          </div>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  );
}

export default Apps;