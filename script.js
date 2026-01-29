        // 双模式访问检测
        (function() {
            // 检测URL hash值
            const hash = window.location.hash.substring(1); // 移除#号
            
            if (hash) {
                // 读取配置数据
                const configElement = document.getElementById('configData');
                let config = {
                    dataMap: {
                        chmlfrp: 'https://panel.chmlfrp.net/tunnel/download',
                        chmlfrpwin386: 'https://cf-v1.uapis.cn/download/ChmlFrp-0.51.2_251023_windows_386.zip',
                        chmlfrpwinamd64: 'https://cf-v1.uapis.cn/download/ChmlFrp-0.51.2_251023_windows_amd64.zip',
                        chmlfrpwinarm64: 'https://cf-v1.uapis.cn/download/ChmlFrp-0.51.2_251023_windows_arm64.zip'
                    }
                };
                
                if (configElement) {
                    try {
                        config = JSON.parse(configElement.textContent);
                    } catch (e) {
                        console.error('配置数据解析失败:', e);
                    }
                }
                
                // 获取对应的值
                const value = config.dataMap[hash] || config.dataMap.default || 'Value not found';
                
                // 清空页面内容并返回数据
                document.body.innerHTML = value;
                document.body.style.margin = '0';
                document.body.style.padding = '0';
                document.body.style.fontFamily = 'monospace';
                
                // 阻止后续代码执行
                return;
            }
        })();

        // 1. 多语言配置
        const langConfig = {
            zh: {
                pageTitle: "508364 的 GitHub 项目集",
                loading: "正在加载项目数据...",
                loadingError: "加载失败：",
                noDesc: "无项目描述",
                langText: "开发语言：",
                viewRepo: "详情",
                openProject: "详情",
                modalTitle: "项目详情",
                modalDesc: "前往项目网页还是代码仓库？",
                webBtn: "项目网页",
                repoBtn: "代码仓库",
                closeBtn: "关闭",
                searchPlaceholder: "搜索项目名称...",
                noResult: "未找到匹配的项目",
                userBio: "GitHub 公开项目合集"
            },
            en: {
                pageTitle: "508364's GitHub Projects",
                loading: "Loading project data...",
                loadingError: "Load failed: ",
                noDesc: "No project description",
                langText: "Language: ",
                viewRepo: "Details",
                openProject: "Details",
                modalTitle: "Project Details",
                modalDesc: "Go to project webpage or code repository?",
                webBtn: "Project Webpage",
                repoBtn: "Code Repository",
                closeBtn: "Close",
                searchPlaceholder: "Search project name...",
                noResult: "No matching projects found",
                userBio: "GitHub Public Projects Collection"
            }
        };
        let currentLang = "zh";
        // DOM 元素获取
        const dom = {
            userName: document.getElementById("userName"),
            userBio: document.getElementById("userBio"),
            userAvatar: document.getElementById("userAvatar"),
            loading: document.getElementById("loading"),
            noResult: document.getElementById("noResult"),
            searchInput: document.getElementById("searchInput"),
            modalTitle: document.getElementById("modalTitle"),
            gotoWebBtn: document.getElementById("gotoWebBtn"),
            gotoRepoBtn: document.getElementById("gotoRepoBtn"),
            closeModalBtn: document.getElementById("closeModalBtn"),
            projectsContainer: document.getElementById("projectsContainer"),
            projectModal: document.getElementById("projectModal"),
            themeToggle: document.getElementById("themeToggle"),
            langSelect: document.getElementById("langSelect"),
            body: document.body,
            // 新模态框元素
            readmeContent: document.getElementById("readmeContent"),
            readmeLoading: document.getElementById("readmeLoading"),
            readmeError: document.getElementById("readmeError"),
            repoName: document.getElementById("repoName"),
            repoDescription: document.getElementById("repoDescription"),
            repoLanguage: document.getElementById("repoLanguage"),
            repoCreated: document.getElementById("repoCreated"),
            repoUpdated: document.getElementById("repoUpdated"),
            repoStars: document.getElementById("repoStars"),
            repoForks: document.getElementById("repoForks"),
            repoInfo: document.getElementById("repoInfo")
        };

        // 2. 语言切换 - 修复渲染逻辑
        function switchLang(lang) {
            currentLang = lang;
            const cfg = langConfig[lang];
            document.title = cfg.pageTitle;
            dom.userBio.textContent = cfg.userBio;
            dom.loading.textContent = cfg.loading;
            dom.searchInput.placeholder = cfg.searchPlaceholder;
            dom.noResult.textContent = cfg.noResult;
            dom.modalTitle.textContent = cfg.modalTitle;
            dom.modalDesc.textContent = cfg.modalDesc;
            dom.gotoWebBtn.textContent = cfg.webBtn;
            dom.gotoRepoBtn.textContent = cfg.repoBtn;
            dom.closeModalBtn.textContent = cfg.closeBtn;
            // 重新渲染项目
            if (window.allRepos) renderProjects(window.allRepos, dom.searchInput.value.trim());
        }
        dom.langSelect.addEventListener("change", (e) => switchLang(e.target.value));

        // 3. 主题切换 - 修复图标切换
        const sunIcon = '<i class="fas fa-sun"></i>';
        const moonIcon = '<i class="fas fa-moon"></i>';
        function initTheme() {
            if (localStorage.getItem('theme') === 'dark') {
                dom.body.setAttribute('data-theme', 'dark');
                dom.themeToggle.innerHTML = sunIcon;
            } else {
                dom.themeToggle.innerHTML = moonIcon;
            }
        }
        initTheme();
        dom.themeToggle.addEventListener('click', () => {
            const isDark = dom.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                dom.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                dom.themeToggle.innerHTML = moonIcon;
            } else {
                dom.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                dom.themeToggle.innerHTML = sunIcon;
            }
        });

        // 4. GitHub 数据拉取 - 全局存储所有项目
        const blockedProjectName = '508364.github.io';
        const githubUsername = '508364';
        const userApiUrl = `https://api.github.com/users/${githubUsername}`;
        const reposApiUrl = `https://api.github.com/users/${githubUsername}/repos`;
        window.allRepos = null; // 全局存储所有项目

        // 获取用户头像
        function fetchUserInfo() {
            fetch(userApiUrl)
                .then(res => res.ok ? res.json() : Promise.reject())
                .then(user => {
                    dom.userAvatar.src = user.avatar_url;
                    dom.userName.textContent = user.name || user.login;
                })
                .catch(() => {
                    dom.userAvatar.src = `https://ui-avatars.com/api/?name=${githubUsername}&background=0366d6&color=fff`;
                });
        }

        // 判断 Pages 项目
        function isPagesRepo(repoName) {
            // 个人GitHub Pages仓库
            if (repoName === `${githubUsername}.github.io`) {
                return true;
            }
            // 允许所有仓库显示"打开网页"按钮，假设它们都可能启用了GitHub Pages
            // 实际项目中可以根据GitHub API获取的信息来判断
            return true;
        }
        
        // 生成GitHub Pages URL
        function getPagesUrl(repoName) {
            if (repoName === `${githubUsername}.github.io`) {
                return `https://${githubUsername}.github.io`;
            }
            // 项目GitHub Pages URL格式
            return `https://${githubUsername}.github.io/${repoName}`;
        }

        // 5. 项目渲染 + 搜索功能 - 核心修复
        function renderProjects(repos, keyword = '') {
            dom.projectsContainer.innerHTML = '';
            const cfg = langConfig[currentLang];
            // 过滤：屏蔽项目 + 搜索关键词
            const filtered = repos.filter(repo => {
                const notBlocked = repo.name !== blockedProjectName;
                const matchKeyword = keyword === '' || repo.name.toLowerCase().includes(keyword.toLowerCase());
                return notBlocked && matchKeyword;
            });

            if (filtered.length === 0) {
                dom.noResult.style.display = 'block';
                return;
            }
            dom.noResult.style.display = 'none';

            filtered.forEach(repo => {
                const hasPages = isPagesRepo(repo.name);
                const webUrl = hasPages ? getPagesUrl(repo.name) : null;
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || cfg.noDesc}</p>
                    <div class="lang">${cfg.langText}${repo.language || 'Unknown'}</div>
                    <button class="project-btn modal-trigger" data-web="${webUrl || ''}" data-repo="${repo.html_url}" data-repo-data='${JSON.stringify(repo)}'>${cfg.viewRepo}</button>
                `;
                dom.projectsContainer.appendChild(card);
            });

            // 绑定模态框触发事件 - 修复事件委托，避免动态元素绑定失效
            dom.projectsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-trigger')) {
                    const webUrl = e.target.dataset.web;
                    const repoUrl = e.target.dataset.repo;
                    const repoData = JSON.parse(e.target.dataset.repoData);
                    
                    // 显示模态框并加载项目详情
                    showProjectModal(repoData, webUrl, repoUrl);
                }
            });
        }

        // 搜索输入事件 - 修复实时搜索
        dom.searchInput.addEventListener('input', (e) => {
            if (window.allRepos) {
                renderProjects(window.allRepos, e.target.value.trim());
            }
        });

        // 6. 显示项目详情模态框
        function showProjectModal(repoData, webUrl, repoUrl) {
            // 设置模态框标题
            dom.modalTitle.textContent = repoData.name;
            
            // 显示加载状态
            dom.readmeLoading.style.display = 'block';
            dom.readmeError.style.display = 'none';
            dom.readmeContent.innerHTML = '<div class="loading" id="readmeLoading">正在加载说明文档...</div>';
            
            // 显示仓库信息
            displayRepoInfo(repoData);
            
            // 设置按钮链接
            dom.gotoRepoBtn.dataset.url = repoUrl;
            
            // 为所有仓库显示"打开网页"按钮
            const pagesUrl = getPagesUrl(repoData.name);
            dom.gotoWebBtn.dataset.url = pagesUrl;
            dom.gotoWebBtn.style.display = 'inline-block';
            
            // 显示模态框
            dom.projectModal.style.display = 'flex';
            
            // 加载README
            fetchReadme(repoData.owner.login, repoData.name);
        }
        
        // 显示仓库信息
        function displayRepoInfo(repoData) {
            dom.repoName.textContent = repoData.name;
            dom.repoLanguage.textContent = repoData.language || 'Unknown';
            dom.repoCreated.textContent = new Date(repoData.created_at).toLocaleDateString();
            dom.repoUpdated.textContent = new Date(repoData.updated_at).toLocaleDateString();
            dom.repoStars.textContent = repoData.stargazers_count;
            dom.repoForks.textContent = repoData.forks_count;
        }
        
        // 7. GitHub API调用获取README
        function fetchReadme(owner, repo) {
            const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
            
            fetch(readmeUrl)
                .then(response => {
                    if (!response.ok) {
                        // 如果main分支没有README，尝试master分支
                        const masterReadmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
                        return fetch(masterReadmeUrl);
                    }
                    return response;
                })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error('README文件不存在');
                })
                .then(text => {
                    // 使用marked库渲染Markdown
                    const html = marked.parse(text);
                    dom.readmeContent.innerHTML = html;
                    
                    // 对代码块进行语法高亮
                    hljs.highlightAll();
                })
                .catch(err => {
                    dom.readmeContent.innerHTML = `<div class="error" id="readmeError">无法加载说明文档：${err.message}</div>`;
                })
                .finally(() => {
                    dom.readmeLoading.style.display = 'none';
                });
        }
        
        // 配置marked使用highlight.js进行代码高亮
        marked.setOptions({
            highlight: function(code, lang) {
                if (hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                } else {
                    return hljs.highlightAuto(code).value;
                }
            },
            breaks: true,
            gfm: true,
            tables: true,
            headerIds: true,
            mangle: false
        });
        
        // 8. 模态框事件 - 修复跳转逻辑
        dom.gotoWebBtn.addEventListener('click', () => {
            window.open(dom.gotoWebBtn.dataset.url, '_blank');
            dom.projectModal.style.display = 'none';
        });
        dom.gotoRepoBtn.addEventListener('click', () => {
            window.open(dom.gotoRepoBtn.dataset.url, '_blank');
            dom.projectModal.style.display = 'none';
        });
        dom.closeModalBtn.addEventListener('click', () => {
            dom.projectModal.style.display = 'none';
        });
        // 点击模态框外部关闭
        dom.projectModal.addEventListener('click', (e) => {
            if (e.target === dom.projectModal) {
                dom.projectModal.style.display = 'none';
            }
        });

        // 7. 初始化加载
        function init() {
            fetchUserInfo();
            dom.loading.style.display = 'block';
            fetch(reposApiUrl)
                .then(response => {
                    if (!response.ok) throw new Error(langConfig[currentLang].loadingError);
                    return response.json();
                })
                .then(repos => {
                    dom.loading.style.display = 'none';
                    window.allRepos = repos; // 存储所有项目
                    renderProjects(repos);
                })
                .catch(err => {
                    dom.loading.style.display = 'block';
                    dom.loading.textContent = `${langConfig[currentLang].loadingError}${err.message}`;
                });
        }
        init();