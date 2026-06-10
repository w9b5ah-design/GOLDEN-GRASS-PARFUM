// Random Joke Generator Application
// Using JokeAPI - https://jokeapi.dev/

class JokeGenerator {
    constructor() {
        this.baseUrl = 'https://v2.jokeapi.dev/joke';
        this.currentJoke = null;
        this.jokeHistory = [];
        this.stats = { jokeCount: 0, shareCount: 0 };

        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.attachEventListeners();
        this.updateStats();
    }

    attachEventListeners() {
        document.getElementById('getJokeBtn').addEventListener('click', () => this.getJoke());
        document.getElementById('copyJokeBtn').addEventListener('click', () => this.copyJoke());
        document.getElementById('shareJokeBtn').addEventListener('click', () => this.shareJoke());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        document.getElementById('showDeliveryBtn').addEventListener('click', () => this.showDelivery());
    }

    async getJoke() {
        try {
            this.showLoading();
            this.clearError();

            const category = document.getElementById('categorySelect').value;
            const jokeType = document.querySelector('input[name="jokeType"]:checked').value;

            let url = `${this.baseUrl}/${category}`;
            const params = [];
            if (jokeType !== 'any') params.push(`type=${jokeType}`);
            params.push('format=json');
            url += `?${params.join('&')}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                this.showError('No jokes found for the selected category.');
                this.hideLoading();
                return;
            }

            this.currentJoke = data;
            this.displayJoke(data);
            this.addToHistory(data);
            this.stats.jokeCount++;
            this.updateStats();
            this.saveToLocalStorage();
            this.hideLoading();

        } catch (error) {
            console.error('Error:', error);
            this.showError('Error fetching joke. Please try again.');
            this.hideLoading();
        }
    }

    displayJoke(joke) {
        const content = document.getElementById('jokeContent');
        const container = document.getElementById('jokeContainer');
        const showDeliveryBtn = document.getElementById('showDeliveryBtn');
        const copyBtn = document.getElementById('copyJokeBtn');
        const shareBtn = document.getElementById('shareJokeBtn');

        if (joke.type === 'single') {
            content.innerHTML = `<div>${joke.joke}</div>`;
            showDeliveryBtn.classList.add('hidden');
        } else {
            content.innerHTML = `<div class="joke-setup">${joke.setup}</div>`;
            showDeliveryBtn.classList.remove('hidden');
        }

        container.classList.remove('hidden');
        copyBtn.classList.remove('hidden');
        shareBtn.classList.remove('hidden');
    }

    showDelivery() {
        if (!this.currentJoke || this.currentJoke.type !== 'twopart') return;
        const content = document.getElementById('jokeContent');
        content.innerHTML = `
            <div class="joke-setup">${this.currentJoke.setup}</div>
            <div class="joke-delivery">${this.currentJoke.delivery}</div>
        `;
        document.getElementById('showDeliveryBtn').classList.add('hidden');
    }

    copyJoke() {
        if (!this.currentJoke) return;
        let text = this.currentJoke.type === 'single' 
            ? this.currentJoke.joke 
            : `${this.currentJoke.setup}\n\n${this.currentJoke.delivery}`;
        
        navigator.clipboard.writeText(text).then(() => {
            alert('Joke copied to clipboard!');
        });
    }

    shareJoke() {
        if (!this.currentJoke) return;
        let text = this.currentJoke.type === 'single' 
            ? this.currentJoke.joke 
            : `${this.currentJoke.setup}\n\n${this.currentJoke.delivery}`;
        
        if (navigator.share) {
            navigator.share({ title: 'Check out this joke!', text: text })
                .then(() => {
                    this.stats.shareCount++;
                    this.updateStats();
                    this.saveToLocalStorage();
                });
        }
    }

    addToHistory(joke) {
        this.jokeHistory.unshift({
            id: Date.now(),
            content: joke.type === 'single' ? joke.joke : `${joke.setup} - ${joke.delivery}`
        });
        if (this.jokeHistory.length > 20) this.jokeHistory.pop();
        this.renderHistory();
    }

    renderHistory() {
        const container = document.getElementById('jokeHistory');
        container.innerHTML = this.jokeHistory.length === 0 
            ? '<li class="empty-history">No jokes yet</li>' 
            : this.jokeHistory.map(item => `<li class="history-item">${item.content.substring(0, 50)}...</li>`).join('');
    }

    clearHistory() {
        if (confirm('Clear all history?')) {
            this.jokeHistory = [];
            this.renderHistory();
            this.saveToLocalStorage();
        }
    }

    updateStats() {
        document.getElementById('jokeCount').textContent = this.stats.jokeCount;
        document.getElementById('shareCount').textContent = this.stats.shareCount;
    }

    showLoading() {
        document.getElementById('loadingSpinner').classList.remove('hidden');
        document.getElementById('jokeContainer').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.add('hidden');
    }

    showError(message) {
        const error = document.getElementById('errorMessage');
        error.textContent = message;
        error.classList.remove('hidden');
        setTimeout(() => error.classList.add('hidden'), 5000);
    }

    clearError() {
        document.getElementById('errorMessage').classList.add('hidden');
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('jokeHistory', JSON.stringify(this.jokeHistory));
            localStorage.setItem('jokeStats', JSON.stringify(this.stats));
        } catch (error) {
            console.error('Error saving:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const history = localStorage.getItem('jokeHistory');
            const stats = localStorage.getItem('jokeStats');
            if (history) this.jokeHistory = JSON.parse(history);
            if (stats) this.stats = JSON.parse(stats);
            this.renderHistory();
        } catch (error) {
            console.error('Error loading:', error);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new JokeGenerator());
} else {
    new JokeGenerator();
}