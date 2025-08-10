import React from "react";

const testimonials = [
  {
    name: "Maria Rodriguez",
    role: "Software Engineer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "SpeakMate helped me gain the confidence to present at tech conferences. The daily challenges made all the difference!",
    rating: 5
  },
  {
    name: "Ahmed Hassan",
    role: "Business Student",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "I went from being afraid to speak in class to leading group discussions. Amazing transformation in just 7 days!",
    rating: 5
  },
  {
    name: "Li Wei",
    role: "Marketing Manager",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    content: "The voice recording feature was perfect for practicing presentations. Now I speak confidently in meetings.",
    rating: 5
  }
];

const TestimonialsSection: React.FC = () => (
  <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-blue-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          What Our Learners Say
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Real stories from real people who improved their English speaking confidence with SpeakMate.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={t.avatar}
              alt={t.name}
              className="w-20 h-20 rounded-full object-cover mb-4 border-4 border-blue-100 shadow"
            />
            <div className="flex items-center gap-1 mb-2">
              {[...Array(t.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">★</span>
              ))}
            </div>
            <blockquote className="text-lg text-gray-700 italic mb-4">"{t.content}"</blockquote>
            <div>
              <div className="font-semibold text-gray-900">{t.name}</div>
              <div className="text-sm text-blue-600">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;