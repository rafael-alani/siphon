import { Github, Linkedin, Mail } from 'lucide-react';

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    bio: 'Former Tesla Energy executive with 15+ years experience in renewable energy.',
    social: {
      github: '#',
      linkedin: '#',
      email: 'sarah@energypeer.com',
    },
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    bio: 'Blockchain expert and former lead developer at Ethereum Foundation.',
    social: {
      github: '#',
      linkedin: '#',
      email: 'marcus@energypeer.com',
    },
  },
  {
    name: 'Emma Wilson',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    bio: 'Energy market specialist with experience at major European utilities.',
    social: {
      github: '#',
      linkedin: '#',
      email: 'emma@energypeer.com',
    },
  },
];

export default function About() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            We're a diverse team of experts passionate about revolutionizing energy trading
            and creating a sustainable future.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {team.map((member) => (
            <div key={member.name} className="space-y-4">
              <div className="aspect-w-3 aspect-h-3">
                <img
                  className="object-cover shadow-lg rounded-lg"
                  src={member.image}
                  alt={member.name}
                />
              </div>
              <div className="space-y-2">
                <div className="text-lg leading-6 font-medium space-y-1">
                  <h3 className="text-gray-900">{member.name}</h3>
                  <p className="text-green-600">{member.role}</p>
                </div>
                <div className="text-base text-gray-500">
                  <p>{member.bio}</p>
                </div>
                <ul className="flex space-x-5">
                  <li>
                    <a href={member.social.github} className="text-gray-400 hover:text-gray-500">
                      <Github className="h-5 w-5" />
                    </a>
                  </li>
                  <li>
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-gray-500">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-gray-500">
                      <Mail className="h-5 w-5" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}