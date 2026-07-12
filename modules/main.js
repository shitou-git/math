export const app = {
    currentPage: 'home',
    
    navigate(page) {
        document.querySelectorAll('.page').forEach(el => {
            el.classList.remove('active');
            el.style.display = 'none';
        });
        
        const target = document.getElementById(page);
        if (target) {
            target.style.display = 'block';
            target.classList.add('active');
        }
        
        document.getElementById('iframeBackBtn').style.display = 'none';
        
        this.currentPage = page;
        
        if (page === 'aoshu' || page === 'dc') {
            document.getElementById('iframeBackBtn').style.display = 'inline-flex';
        }
        
        if (typeof window[`init${page.charAt(0).toUpperCase() + page.slice(1)}`] === 'function') {
            window[`init${page.charAt(0).toUpperCase() + page.slice(1)}`]();
        }
    },
    
    async init() {
        const modules = await Promise.all([
            import('./sudoku.js'),
            import('./magic.js'),
            import('./arithmetic.js'),
            import('./schulte.js'),
            import('./aoshu.js'),
            import('./silu.js'),
            import('./dc.js')
        ]);
        window.initSudoku = modules[0].initSudoku;
        window.initMagic = modules[1].initMagic;
        window.initArithmetic = modules[2].initArithmetic;
        window.initSchulte = modules[3].initSchulte;
        window.initAoshu = modules[4].initAoshu;
        window.initSilu = modules[5].initSilu;
        window.initDc = modules[6].initDc;
    }
};

app.init();