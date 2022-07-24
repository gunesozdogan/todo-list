export default loadInboxPage;

import UI from './UI';

const inbox = document.querySelector('.inbox');
inbox.addEventListener('click', loadInboxPage);

function loadInboxPage() {
    // CLEARS ALL THE CONTENT OF MAIN CONTENT
    const myUI = UI;
    const mainContent = document.querySelector('.main-content');
    myUI.removeAllChildNodes(mainContent);

    //LOADS INBOX PAGE
    const content = myUI.createElement(...['div', ['content-inbox'], , , ,]);
    const h2 = myUI.createElement(...['h2', , ['textContent'], ['Inbox']]);

    myUI.createAddTaskButton(content);
    mainContent.append(h2, content);
}
