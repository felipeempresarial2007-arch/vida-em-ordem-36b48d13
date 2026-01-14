import { useEffect, useRef } from 'react';

// Base64 encoded short welcome chime sound
const WELCOME_SOUND_BASE64 = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYNbK1BAAAAAAAAAAAAAAAAAAAAAP/7UGQAD/AAADSAAAAANIAAAGkAAAAATNwAFwAAGiAAAANJ4AC4AAAApCMAAAAAYAADAAAAAAAAP8CAIPBAEf/4IAgCAI/8EAQ/BA/8EAQBH/gg+H//4Ig+CD/+CD///wdB0HQdBwHP///BA//gg///+CIOg6D/8EH//gg/Bg+P/BA+D/gg//4Ig/8EH//BA+CB8H4MHwQBA+CBBMhH/4IHwQP+CAIAg+D8GD/gg+D4Pg+CB8EAP/BAGH/ggCD4IH+D4IHwf+CAP/BA//ggfB//5AYcbOo8+D/BA///ggfBA//gg+CB/gg/BA+CAIEA//tQZAAP8AAADSAAAAAAAANIAAAAAAAANIAAAAAAAANJwAAAACG4W/4IH+D8H4MH/BA//gg//wQPggf4Pg/BA///gg///+CD/+CIP/ggf/4IAgD/wQPgg//ggf/+CB//gg//wf///wQP//+CD///4IP////gg////4IP///+CD////gg////4IP////Bw//wQB//ggCB8ED4IH/+CD//4IH//gg//+D//gg//+D//wQP//BA///BA///BA///gg///gg///gg///gg///4IP//4IH//4IH///gg//gg//4IH/+D8EAf/wQf/4IH/+CB//4IH/+CB//gg//4IH/+D/wQB//BA//ggf/+CB//BA';

export function useWelcomeSound() {
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    // Only play once per session
    const sessionPlayed = sessionStorage.getItem('focus30_welcome_sound_played');
    if (sessionPlayed || hasPlayedRef.current) return;

    // Mark as played
    hasPlayedRef.current = true;
    sessionStorage.setItem('focus30_welcome_sound_played', 'true');

    // Small delay for better UX
    const timer = setTimeout(() => {
      try {
        const audio = new Audio(WELCOME_SOUND_BASE64);
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Browser may block autoplay, that's okay
        });
      } catch {
        // Audio not supported
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);
}
