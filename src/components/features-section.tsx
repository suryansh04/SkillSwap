import { cn } from "../lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
  IconCode,
  IconSearch,
  IconCalendarEvent,
  IconExchange,
  IconStar,
  IconShieldLock,
} from "@tabler/icons-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Create Your Profile",
      description: "Build a comprehensive profile with your skills, location, and availability. Choose to keep it public or private.",
      icon: <IconTerminal2 className="w-6 h-6" />,
    },
    {
      title: "Browse & Search",
      description: "Find people with the skills you need. Search by skill type, location, or availability to find the perfect match.",
      icon: <IconSearch className="w-6 h-6" />,
    },
    {
      title: "Flexible Scheduling",
      description: "Set your availability for weekends, evenings, or any time that works for you. Coordinate easily with swap partners.",
      icon: <IconCalendarEvent className="w-6 h-6" />,
    },
    {
      title: "Request & Accept Swaps",
      description: "Send swap requests and manage incoming offers. Accept or reject requests and track all your pending exchanges.",
      icon: <IconExchange className="w-6 h-6" />,
    },
    {
      title: "Ratings & Feedback",
      description: "Rate your experience after each swap. Build trust in the community through honest feedback and reviews.",
      icon: <IconStar className="w-6 h-6" />,
    },
    {
      title: "Safe & Secure",
      description: "Control your privacy settings, delete unwanted requests, and connect safely with verified community members.",
      icon: <IconShieldLock className="w-6 h-6" />,
    },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Swap Skills
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform makes it easy to connect, exchange, and grow your skillset with others in your community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index
}) => {
  return (
    <div
      className={cn(
        "flex flex-col py-8 px-6 relative group/feature dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200",
        index % 3 !== 2 && "lg:border-r dark:border-neutral-800",
        index < 3 && "border-b dark:border-neutral-800"
      )}>
      <div className="mb-4 relative z-10 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10">
        <div
          className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </div>
  );
};

export default FeaturesSection;
