
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SpeedTypingGame.css';
import TypingArea from './TypingArea';
import TimeSelector from './TimeSelector';

const paragraphs = [
  `A plant is one of the most important living things that develop on the earth and is made up of stems, leaves, roots, and so on. Parts of Plants: The part of the plant that developed beneath the soil is referred to as root and the part that grows outside of the soil is known as shoot. The shoot consists of stems, branches, leaves, fruits, and flowers. Plants are made up of six main parts: roots, stems, leaves, flowers, fruits, and seeds.`,
  `The root is the part of the plant that grows in the soil. The primary root emerges from the embryo. Its primary function is to provide the plant stability in the earth and make other mineral salts from the earth available to the plant for various metabolic processes There are three types of roots i.e. Tap Root, Adventitious Roots, and Lateral Root. The roots arise from the parts of the plant and not from the rhizomes roots.`,
  `Stem is the posterior part that remains above the ground and grows negatively geotropic. Internodes and nodes are found on the stem. Branch, bud, leaf, petiole, flower, and inflorescence on a node are all those parts of the plant that remain above the ground and undergo negative subsoil development. The trees have brown bark and the young and newly developed stems are green. The roots arise from the parts of plant and not from the rhizomes roots.`,
  `It is the blossom of a plant. A flower is the part of a plant that produces seeds, which eventually become other flowers. They are the reproductive system of a plant. Most flowers consist of 04 main parts that are sepals, petals, stamens, and carpels. The female portion of the flower is the carpels. The majority of flowers are hermaphrodites, meaning they have both male and female components. Others may consist of one of two parts and may be male or female.`,
  `An aunt is a bassoon from the right perspective. As far as we can estimate, some posit the melic myanmar to be less than kutcha. One cannot separate foods from blowzy bows. The scampish closet reveals itself as a sclerous llama to those who look. A hip is the skirt of a peak. Some hempy laundries are thought of simply as orchids. A gum is a trumpet from the right perspective. A freebie flight is a wrench of the mind. Some posit the croupy.`
];


const SpeedTypingGame = () => {
  const [maxTime, setMaxTime] = useState(60);
  const [typingText, setTypingText] = useState('');
  const [inpFieldValue, setInpFieldValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  
  const inputRef = useRef(null);

  const loadParagraph = useCallback(() => {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
      <span
        key={index}
        className={`char ${letter === ' ' ? 'space' : ''} ${
          index === 0 ? 'active' : ''
        }`}
      >
        {letter}
      </span>
    ));
    setTypingText(content);
    setInpFieldValue('');
    setCharIndex(0);
    setMistakes(0);
    setIsTyping(false);
    setCPM(0);
    setWPM(0);
  }, []);

  const resetGame = useCallback(() => {
    setIsTyping(false);
    setTimeLeft(maxTime);
    setCharIndex(0);
    setMistakes(0);
    setTypingText('');
    setCPM(0);
    setWPM(0);
    setAccuracy(100);

    const characters = document.querySelectorAll('.char');
    if (characters.length) {
      characters.forEach((span) => {
        span.classList.remove('correct', 'wrong', 'active');
      });
    }
    loadParagraph();

    if (inputRef.current) inputRef.current.focus();
  }, [maxTime, loadParagraph]);

  useEffect(() => {
    resetGame();
  }, [maxTime, resetGame]);

  const handleTimeChange = (newTime) => {
    setMaxTime(newTime);
  };

  const handleKeyDown = (event) => {
    const characters = document.querySelectorAll('.char');
    if (
      event.key === 'Backspace' &&
      charIndex > 0 &&
      charIndex <= characters.length &&
      timeLeft > 0
    ) {
      const prevIndex = charIndex - 1;
      if (characters[prevIndex].classList.contains('correct')) {
        characters[prevIndex].classList.remove('correct');
      }
      if (characters[prevIndex].classList.contains('wrong')) {
        characters[prevIndex].classList.remove('wrong');
        setMistakes((m) => Math.max(0, m - 1));
      }

      if (characters[charIndex]) characters[charIndex].classList.remove('active');
      if (characters[prevIndex]) characters[prevIndex].classList.add('active');

      setCharIndex((ci) => ci - 1);
    }
  };

  const initTyping = (event) => {
    const characters = document.querySelectorAll('.char');
    const fullValue = event.target.value;
    setInpFieldValue(fullValue);

    const typedChar = fullValue.slice(-1);

    if (charIndex < characters.length && timeLeft > 0) {
      let currentChar = characters[charIndex].textContent;

      if (!isTyping) setIsTyping(true);

      if (typedChar === currentChar) {
        characters[charIndex].classList.remove('active');
        characters[charIndex].classList.add('correct');
      } else {
        characters[charIndex].classList.remove('active');
        characters[charIndex].classList.add('wrong');
        setMistakes((m) => m + 1);
      }

      if (charIndex + 1 < characters.length) {
        characters[charIndex + 1].classList.add('active');
      }

      setCharIndex((ci) => ci + 1);

      const elapsed = maxTime - timeLeft || 1;
      const correctChars = (charIndex + 1) - (mistakes + (typedChar === currentChar ? 0 : 1));
      const wpmCalc = Math.round((correctChars / 5) / elapsed * 60);
      const cpmCalc = Math.floor(correctChars * (60 / elapsed));
      setWPM(wpmCalc < 0 || !isFinite(wpmCalc) ? 0 : wpmCalc);
      setCPM(cpmCalc < 0 || !isFinite(cpmCalc) ? 0 : cpmCalc);
    } else {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const handleDocKeydown = () => {
      if (inputRef.current) inputRef.current.focus();
    };
    document.addEventListener('keydown', handleDocKeydown);
    return () => {
      document.removeEventListener('keydown', handleDocKeydown);
    };
  }, []); 

  useEffect(() => {
    let interval = null;
    
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1); 
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTyping(false);
    }
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTyping, timeLeft]); 

  useEffect(() => {
    if (charIndex === 0) {
      setAccuracy(100);
      return;
    }
    const correctChars = Math.max(0, charIndex - mistakes);
    const newAccuracy = (correctChars / charIndex) * 100;
    setAccuracy(Math.max(0, newAccuracy.toFixed(0)));
  }, [charIndex, mistakes]);

  const isTestOver = timeLeft === 0;

  return (
    <>
      <div className="vertical-logo">Typing Arena</div>

      <div className="container">
        <h1 className="logo">
          <span className="logo-t">T</span>yping <span className="logo-a">A</span>rena
        </h1>

        {!isTestOver && (
          <TimeSelector
            maxTime={maxTime}
            onTimeChange={handleTimeChange}
            isTyping={isTyping}
          />
        )}

        {!isTestOver && (
          <input
            ref={inputRef}
            type="text"
            className="input-field"
            value={inpFieldValue}
            onChange={initTyping}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
        )}
        
        <TypingArea
          typingText={typingText}
          timeLeft={timeLeft}
          mistakes={mistakes}
          WPM={WPM}
          CPM={CPM}
          resetGame={resetGame}
          accuracy={accuracy}
          isTestOver={isTestOver}
        />
      </div>

      <footer className="footer">
        Made with ❤️ by Mayank
      </footer>

      <div className="social-links">
        <a href="https://github.com/heyy-Mayank" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297z"/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/mayank0612/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
          </svg>
        </a>
      </div>
    </>
  );
};

export default SpeedTypingGame;