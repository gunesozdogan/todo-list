import UI from './UI';

const today = document.querySelector('.today');
today.addEventListener('click', loadTodayPage);

function loadTodayPage() {
    // CLEARS ALL THE CONTENT OF MAIN CONTENT
    const myUI = UI;
    const mainContent = document.querySelector('.main-content');
    myUI.removeAllChildNodes(mainContent);

    // LOADS TODAY PAGE
    const h2 = myUI.createElement(...['h2', , ['textContent'], ['Today']]);
    mainContent.appendChild(h2);
}
