import React, { useState, useEffect } from 'react';
import { RefreshCw, BookOpen, Star, Lightbulb, TrendingUp, Quote } from 'lucide-react';

const Motivation: React.FC = () => {
  const [dailyQuote, setDailyQuote] = useState('');
  const [powerWord, setPowerWord] = useState<{ word: string; definition: string; example: string } | null>(null);
  const [funFact, setFunFact] = useState('');
  const [phraseOfDay, setPhraseOfDay] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const motivationalPhrases = [
    {
      phrase: "Break a leg!",
      meaning: "Good luck! (especially before a performance)",
      example: "Break a leg in your presentation today!"
    },
    {
      phrase: "Don't give up the day job",
      meaning: "You're not good enough at this to make it your career",
      example: "Your singing is nice, but don't give up the day job."
    },
    {
      phrase: "Every cloud has a silver lining",
      meaning: "There's something good in every bad situation",
      example: "I lost my job, but every cloud has a silver lining - now I can pursue my passion."
    },
    {
      phrase: "Practice makes perfect",
      meaning: "Doing something repeatedly makes you better at it",
      example: "Keep practicing your English speaking - practice makes perfect!"
    },
    {
      phrase: "Rome wasn't built in a day",
      meaning: "Important things take time to develop",
      example: "Don't worry about your accent - Rome wasn't built in a day."
    },
    {
      phrase: "The early bird catches the worm",
      meaning: "People who start early have an advantage",
      example: "I study English every morning - the early bird catches the worm."
    },
    {
      phrase: "When life gives you lemons, make lemonade",
      meaning: "Make the best of a bad situation",
      example: "Lost your job? When life gives you lemons, make lemonade - start your own business!"
    },
    {
      phrase: "You can't judge a book by its cover",
      meaning: "Don't judge based on appearance alone",
      example: "He looks tough, but you can't judge a book by its cover - he's very kind."
    }
  ];

  const speakingTips = [
    "Start each day by speaking to yourself in English for 5 minutes",
    "Record yourself speaking and listen back to identify areas for improvement",
    "Practice tongue twisters to improve pronunciation and articulation",
    "Join online English speaking communities to practice with others",
    "Watch English movies with subtitles, then without subtitles",
    "Read aloud for 10 minutes daily to improve fluency and confidence",
    "Practice describing what you see around you in English",
    "Set a goal to learn 3 new words every day and use them in sentences",
    "Don't be afraid of making mistakes - they're part of learning",
    "Practice speaking about topics you're passionate about"
  ];

  useEffect(() => {
    fetchDailyContent();
  }, []);

  const fetchDailyContent = async () => {
    setIsLoading(true);
    try {
      // Fetch daily quote
      try {
        const quoteResponse = await fetch('https://zenquotes.io/api/random');
        const quoteData = await quoteResponse.json();
        if (quoteData && quoteData[0]) {
          setDailyQuote(quoteData[0].q);
        }
      } catch {
        setDailyQuote('The only way to do great work is to love what you do.');
      }

      // Fetch power word
      try {
        const wordResponse = await fetch('https://random-word-api.herokuapp.com/word');
        const wordData = await wordResponse.json();
        if (wordData && wordData[0]) {
          const word = wordData[0];
          const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
          const definitionData = await definitionResponse.json();
          
          let definition = 'A useful English word to expand your vocabulary.';
          let example = `"${word}" is a great word to add to your vocabulary.`;
          
          if (definitionData && definitionData[0] && definitionData[0].meanings && definitionData[0].meanings[0]) {
            definition = definitionData[0].meanings[0].definitions[0].definition;
            example = definitionData[0].meanings[0].definitions[0].example || example;
          }
          
          setPowerWord({ word, definition, example });
        }
      } catch {
        setPowerWord({
          word: 'Resilience',
          definition: 'The ability to recover quickly from difficulties; toughness.',
          example: 'Her resilience helped her overcome many challenges in life.'
        });
      }

      // Fetch fun fact
      try {
        const factResponse = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const factData = await factResponse.json();
        if (factData && factData.text) {
          setFunFact(factData.text);
        }
      } catch {
        setFunFact('The English language has over 170,000 words currently in use!');
      }

      // Set random phrase of the day
      const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
      setPhraseOfDay(randomPhrase.phrase);

    } catch (error) {
      console.error('Error fetching daily content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPhraseData = motivationalPhrases.find(p => p.phrase === phraseOfDay) || motivationalPhrases[0];
  const randomTip = speakingTips[Math.floor(Math.random() * speakingTips.length)];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Daily Motivation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get inspired with daily quotes, power words, and English phrases to fuel your learning journey.
          </p>
          <button
            onClick={fetchDailyContent}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Content
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Quote */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center mb-6">
              <Quote className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Quote of the Day</h2>
            </div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-3"></div>
                <div className="h-4 bg-white/20 rounded mb-3 w-4/5"></div>
                <div className="h-4 bg-white/20 rounded w-3/5"></div>
              </div>
            ) : (
              <blockquote className="text-xl md:text-2xl leading-relaxed italic">
                "{dailyQuote}"
              </blockquote>
            )}
          </div>

          {/* Power Word */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center mb-6">
              <Star className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Power Word</h2>
            </div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-white/20 rounded mb-4 w-2/3"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded mb-4 w-4/5"></div>
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
              </div>
            ) : powerWord ? (
              <div>
                <h3 className="text-3xl font-bold mb-4 capitalize">{powerWord.word}</h3>
                <p className="text-green-100 mb-4 text-lg leading-relaxed">
                  {powerWord.definition}
                </p>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm text-green-100 mb-1">Example:</p>
                  <p className="italic">"{powerWord.example}"</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Phrase of the Day */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center mb-6">
              <Lightbulb className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Phrase of the Day</h2>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">"{currentPhraseData.phrase}"</h3>
              <p className="text-orange-100 mb-4 text-lg">
                <strong>Meaning:</strong> {currentPhraseData.meaning}
              </p>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-orange-100 mb-1">Example:</p>
                <p className="italic">"{currentPhraseData.example}"</p>
              </div>
            </div>
          </div>

          {/* Fun Fact */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center mb-6">
              <BookOpen className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Fun Fact</h2>
            </div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded mb-2 w-5/6"></div>
                <div className="h-4 bg-white/20 rounded w-4/5"></div>
              </div>
            ) : (
              <p className="text-lg leading-relaxed">
                {funFact}
              </p>
            )}
          </div>
        </div>

        {/* Speaking Tips Section */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 mr-3 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900">Daily Speaking Tips</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Today's Tip */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Today's Tip</h3>
                <p className="text-blue-800 leading-relaxed">
                  {randomTip}
                </p>
              </div>

              {/* Quick Tips List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Quick Confidence Boosters</h3>
                <ul className="space-y-3">
                  <li className="flex items-start text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm">Practice in front of a mirror daily</span>
                  </li>
                  <li className="flex items-start text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm">Start conversations with yourself</span>
                  </li>
                  <li className="flex items-start text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm">Celebrate small improvements</span>
                  </li>
                  <li className="flex items-start text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm">Focus on communication, not perfection</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Weekly Challenge */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🏆 This Week's Challenge</h3>
              <p className="text-gray-700 mb-4">
                Try to use your power word and phrase of the day in at least 3 different conversations this week.
                Notice how native speakers react and learn from their responses.
              </p>
              <div className="flex items-center text-sm text-green-700">
                <Star className="w-4 h-4 mr-2" />
                <span>Complete this challenge to build confidence and expand your vocabulary naturally!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Motivation;