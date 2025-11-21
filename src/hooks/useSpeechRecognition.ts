import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Ref to track if we *should* be listening (to handle auto-restarts)
    const shouldListenRef = useRef(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const hasSupport = typeof window !== 'undefined' &&
        (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

    useEffect(() => {
        if (!hasSupport) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        // RETRY STRATEGY for continuous: true
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ja-JP';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let fullTranscript = '';
            // Accumulate all results (final and interim)
            for (let i = 0; i < event.results.length; ++i) {
                fullTranscript += event.results[i][0].transcript;
            }
            setTranscript(fullTranscript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error', event.error);

            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setError('Microphone access denied.');
                setIsListening(false);
                shouldListenRef.current = false;
            } else if (event.error === 'network') {
                setError('Network error. Retrying...');
                // Don't stop `shouldListenRef`, let onend try to restart
            } else {
                setError(event.error);
            }
        };

        recognition.onend = () => {
            // If we still want to listen, restart!
            if (shouldListenRef.current) {
                console.log('Restarting speech recognition...');
                try {
                    recognition.start();
                } catch (e) {
                    console.error('Failed to restart:', e);
                    setIsListening(false);
                    shouldListenRef.current = false;
                }
            } else {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, [hasSupport]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !shouldListenRef.current) {
            setTranscript('');
            setError(null);
            shouldListenRef.current = true;
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error(e);
                shouldListenRef.current = false;
            }
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && shouldListenRef.current) {
            shouldListenRef.current = false;
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        hasSupport,
        error,
        setTranscript
    };
};
