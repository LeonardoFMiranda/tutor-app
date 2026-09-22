const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { useChat } = require('@ai-sdk/react');

function TestComponent() {
  const chat = useChat({ api: '/api/chat' });
  console.log("KEYS:", Object.keys(chat));
  return React.createElement('div', null, 'hello');
}

try {
  ReactDOMServer.renderToString(React.createElement(TestComponent));
} catch (e) {
  console.error("Error:", e);
}
