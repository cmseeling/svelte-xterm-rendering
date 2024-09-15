let lastSessionId = 0;
const fetchedSessions: number[] = [];

export const createSession = () => {
	lastSessionId++;
	return lastSessionId;
};

// This simulates the call to to read the pseudoterminal buffer.
// The buffer would only return something if the pty was updated.
// For this example, we are simulating the buffer being read out once
// on xterm creation, with the pty never sending a new update for that session.
export const readBuffer = (sessionId: number) => {
	console.log(`reading buffer for sessionId: ${sessionId}`);
	if (fetchedSessions.includes(sessionId)) {
		console.log('buffer empty');
		return '';
	} else {
		console.log('sending prompt');
		fetchedSessions.push(sessionId);
		return 'Hostname  09/15/24 12:00:00PM  /usr/home_dir/ $_ ';
	}
};
