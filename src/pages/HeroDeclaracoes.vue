<template>
  <section class="integrated-certifications-section">
    <div class="hero-background">
      <div class="hero-overlay"></div>
      
      <div class="main-container">

        <div class="hero-content">

          <div class="hero-badge">
            <i class="bi bi-award me-2"></i>
            <span>Certificações Oficiais</span>
          </div>

          <h1 class="hero-title">
            <span class="title-main">Nossas</span>
            <span class="title-highlight">Declarações</span>
          </h1>
          
          <!-- Subtitle -->
          <p class="hero-subtitle">
            Consulte os <span class="highlight-text">Certificados oficiais</span> dos alunos que concluíram nossos cursos com sucesso.
          </p>
          
          <!-- Features with Icons -->
          <div class="hero-features">
            <div class="feature-item">
              <i class="bi bi-check-circle-fill"></i>
              <span>Certificados Oficiais</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill"></i>
              <span>Busca por Nome</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-check-circle-fill"></i>
              <span>Código Único</span>
            </div>
          </div>
          
          <!-- Search Form Integrated -->
<div class="search-wrapper-hero">
  <form @submit.prevent="handleSearch" class="search-form">
    <div class="search-input-group">
      <i class="bi bi-search search-icon"></i>
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="Pesquisar certificado..."
      />
      <button type="submit" class="search-button">
        <span class="button-text-desktop">Buscar</span>
        <i class="bi bi-arrow-right button-icon-mobile"></i>
      </button>
    </div>
  </form>
</div>
        </div>

        <!-- Wave Divider for Smooth Transition -->
        <div class="wave-divider">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,0 C480,120 960,0 1440,120 L1440,120 L0,120 Z" fill="url(#wave-gradient)"></path>
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:rgba(59,76,184,0.1);stop-opacity:1" />
                <stop offset="50%" style="stop-color:rgba(22,36,21,0.05);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgba(59,76,184,0.1);stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <!-- Recent Certifications Integrated Below -->
        <div class="recent-certifications">
          <h2 class="section-title">Certificações Recentes</h2>
          <p class="section-subtitle">Profissionais certificados recentemente – Inspire-se com suas conquistas!</p>

          <!-- Loading -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
          </div>

          <!-- CAROUSEL + CARDS -->
          <div
            v-else-if="filteredDeclaracoes.length > 0"
            class="carousel-wrapper"
          >
            <transition-group
              name="slide-fade"
              tag="div"
              class="carousel-track"
              ref="carouselTrack"
            >
              <div
                v-for="declaracao in paginatedDeclaracoes"
                :key="declaracao.id"
                class="carousel-slide"
              >
                <div class="cert-card">
                  <div class="card-top-line"></div>

                  <!-- FOTO + BADGE -->
                  <div class="photo-wrapper">
                    <img
                      :src="declaracao.foto"
                      :alt="declaracao.nomeCompleto"
                      @error="handleImageError"
                    />
                    <div class="check-badge">
                      <i class="bi bi-patch-check-fill"></i>
                    </div>
                  </div>

                  <!-- CONTEÚDO -->
                  <div class="card-content">
                    <h3 class="student-name">{{ declaracao.nomeCompleto }}</h3>

                    <div class="course-badge">
                      <i class="bi bi-mortarboard-fill"></i>
                      <span>{{ declaracao.curso }}</span>
                    </div>

                    <div class="info-grid">
                      <div class="info-box">
                        <i class="bi bi-calendar-check"></i>
                        <div class="info-text">
                          <span class="info-label">Conclusão</span>
                          <span class="info-value">{{ formatDate(declaracao.dataConclusao) }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="divider"></div>

                    <button
                      @click="emitViewDetails(declaracao)"
                      class="cert-button"
                    >
                      <span>Visualizar Certificado</span>
                      <i class="bi bi-arrow-right-circle-fill"></i>
                    </button>

                  </div>
                </div>
              </div>
            </transition-group>

            <!-- PAGINAÇÃO COM DOTS -->
<div v-if="totalPages > 1" class="pagination-dots">
  <div class="dots-container">
    <button
      v-for="page in Math.min(totalPages, 4)"
      :key="page"
      class="dot"
      :class="{ active: page === currentPage }"
      @click="goToPage(page)"
      :aria-label="`Ir para página ${page}`"
    ></button>
  </div>
</div>
          </div>

          <!-- EMPTY STATE -->
          <div v-else class="empty-state">
            <i class="bi bi-folder2-open"></i>
            <p v-if="searchQuery">Nenhuma certificação encontrada para "{{ searchQuery }}"</p>
            <p v-else>Sem certificações disponíveis</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroDeclaracoes',
  props: {
    declaracoes: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  emits: ["viewDetails"],
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      cardsPerPage: 4,
      autoPlayInterval: null,
      isTransitioning: false,
    }
  },
  computed: {
    filteredDeclaracoes() {
      if (!this.searchQuery.trim()) {
        return this.declaracoes;
      }
      
      const query = this.searchQuery.toLowerCase().trim();
      return this.declaracoes.filter(declaracao => {
        return (
          declaracao.nomeCompleto?.toLowerCase().includes(query) ||
          declaracao.curso?.toLowerCase().includes(query) ||
          declaracao.id?.toString().includes(query)
        );
      });
    },
    
    totalPages() {
      return Math.ceil(this.filteredDeclaracoes.length / this.cardsPerPage);
    },
    
    paginatedDeclaracoes() {
      const start = (this.currentPage - 1) * this.cardsPerPage;
      return this.filteredDeclaracoes.slice(start, start + this.cardsPerPage);
    },
    
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    },
  },
  
  watch: {
    searchQuery() {
      this.currentPage = 1;
    }
  },
  
  mounted() {
    this.updateCardsPerPage();
    window.addEventListener("resize", this.updateCardsPerPage);
    this.$nextTick(() => {
      this.startAutoPlay();
    });
  },
  
  beforeUnmount() {
    window.removeEventListener("resize", this.updateCardsPerPage);
    this.stopAutoPlay();
  },
  
  methods: {
    handleSearch() {
      // Função de busca sem logs
    },
    
    emitViewDetails(declaracao) {
      this.$emit("viewDetails", declaracao);
    },
    
    formatDate(dateString) {
      if (!dateString) return "---";
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    
    handleImageError(event) {
      const declaracao = this.declaracoes.find(d => d.foto === event.target.src);
      if (declaracao) {
        event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(declaracao.nomeCompleto)}&background=3b82f6&color=fff&size=200`;
      } else {
        event.target.src = "https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&size=200";
      }
    },
    
    updateCardsPerPage() {
      const width = window.innerWidth;
      this.cardsPerPage = width < 640 ? 1 : width < 1024 ? 2 : width < 1280 ? 3 : 4;
      
      this.stopAutoPlay();
      if (width < 768 && this.totalPages > 1) {
        this.startAutoPlay();
      }
    },
    
    nextPage() {
      if (this.isTransitioning) return;
      
      this.isTransitioning = true;
      
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      } else if (window.innerWidth < 768) {
        this.currentPage = 1;
      }
      
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    },
    
    previousPage() {
      if (this.isTransitioning) return;
      
      this.isTransitioning = true;
      
      if (this.currentPage > 1) {
        this.currentPage--;
      } else if (window.innerWidth < 768) {
        this.currentPage = this.totalPages;
      }
      
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    },
    
    goToPage(page) {
      if (this.isTransitioning || page === this.currentPage) return;
      
      this.isTransitioning = true;
      this.currentPage = page;
      
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    },
    
    startAutoPlay() {
      const width = window.innerWidth;
      if (width < 768 && this.declaracoes.length > 1) {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
          this.nextPage();
        }, 4000);
      }
    },
    
    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    },
  }
}
</script>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.integrated-certifications-section {
  position: relative;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.hero-background {
  position: relative;
  min-height: 650px;
  background-image: url('@/assets/imagens/livro.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  padding-top: 80px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 76, 184, 0.85) 0%, rgba(22, 36, 21, 0.7) 50%, rgba(255,255,255,0) 100%);
  z-index: 1;
}

.main-container {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.hero-content {
  text-align: center;
  color: white;
  padding: 2rem 1rem;
  animation: fadeInUp 0.8s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.hero-badge i {
  color: #ffc107;
  font-size: 1rem;
}

.hero-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1rem;
  animation: glowTitle 2s ease-in-out infinite alternate;
}

@keyframes glowTitle {
  from { text-shadow: 0 0 10px rgba(255, 235, 59, 0.3); }
  to { text-shadow: 0 0 20px rgba(255, 235, 59, 0.7); }
}

.title-main {
  color: white;
}

.title-highlight {
  background: linear-gradient(135deg, #ffc107, #ffeb3b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-left: 0.5rem;
}

.hero-subtitle {
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.highlight-text {
  color: #ffc107;
  font-weight: 500;
}

.hero-features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 500;
}

.feature-item i {
  color: #28a745;
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.search-wrapper-hero {
  max-width: 700px;
  margin: 0 auto;
  animation: fadeInUp 1s ease-out 0.3s both;
}

.search-form {
  width: 100%;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.search-input-group:focus-within {
  border-color: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.search-icon {
  color: #999;
  font-size: 1.2rem;
  margin-right: 1rem;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  outline: none;
  padding: 0.5rem 0;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  background: linear-gradient(135deg, #3b4cb8, #4e73df);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(59, 76, 184, 0.6);
}

.wave-divider {
  position: relative;
  height: 120px;
  margin-top: -60px;
  overflow: hidden;
}

.wave-divider svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
}

.recent-certifications {
  padding: 40px 0 60px;
  position: relative;
  z-index: 3;
  background: white;
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  box-shadow: 0 -20px 40px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 2.2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -1px;
  animation: slideDown 0.8s ease-out;
}

.section-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 30px;
  font-weight: 500;
  animation: fadeIn 1s ease-out 0.3s both;
}

.section-subtitle::before,
.section-subtitle::after {
  content: '✨';
  color: #ffc107;
  margin: 0 12px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e0e7ff;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

.loading-state::after {
  content: 'Carregando certificações...';
  font-size: 1rem;
  color: #64748b;
  font-weight: 600;
  margin-top: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-state i {
  font-size: 60px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.carousel-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 8px;
  position: relative;
}

@media (max-width: 768px) {
  .carousel-track {
    flex-wrap: nowrap;
    overflow: visible;
    min-height: 420px;
    padding: 0;
    margin-bottom: 10px;
    justify-content: center;
    align-items: flex-start;
  }
  
  .carousel-slide {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 85% !important;
    max-width: 320px !important;
    margin: 0;
  }
}

.slide-fade-enter-active {
  animation: slideInDesktop 0.5s ease-out;
}

.slide-fade-leave-active {
  animation: slideOutDesktop 0.4s ease-in;
}

@media (max-width: 768px) {
  .slide-fade-enter-active {
    animation: slideInMobile 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-fade-leave-active {
    animation: slideOutMobile 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.carousel-slide {
  flex: 0 0 auto;
  width: 100%;
  max-width: 280px;
  display: flex;
}

.cert-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 3px 16px rgba(30, 58, 138, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid #e2e8f0;
  width: 100%;
}

.cert-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
  border-color: #3b82f6;
}

.card-top-line {
  height: 4px;
  background: linear-gradient(90deg, #1e3a8a, #3b82f6, #60a5fa);
}

.photo-wrapper {
  padding: 20px 20px 0;
  display: flex;
  justify-content: center;
  position: relative;
}

.photo-wrapper img {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e0e7ff;
  box-shadow: 0 6px 20px rgba(30, 58, 138, 0.15);
  transition: all 0.3s ease;
}

.cert-card:hover .photo-wrapper img {
  border-color: #3b82f6;
  transform: scale(1.05) rotate(5deg);
}

.check-badge {
  position: absolute;
  bottom: -5px;
  right: 35%;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.check-badge i {
  font-size: 18px;
  color: #3b82f6;
}

.card-content {
  padding: 18px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.student-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  line-height: 1.3;
  min-height: 2.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.course-badge {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  padding: 8px 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.course-badge i {
  color: #1e3a8a;
  font-size: 0.95rem;
}

.course-badge span {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e3a8a;
  text-align: center;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.info-box i {
  color: #3b82f6;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 4px 0;
}

.cert-button {
  width: 100%;
  padding: 11px 16px;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 14px rgba(30, 58, 138, 0.25);
  margin-top: auto;
}

.cert-button:hover {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 58, 138, 0.35);
}

.cert-button i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.cert-button:hover i {
  transform: translateX(4px);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
}

.nav-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  font-size: 1rem;
}

.nav-btn:hover:not(:disabled) {
  background: #1e3a8a;
  border-color: #1e3a8a;
  color: white;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  font-weight: 600;
  font-size: 0.85rem;
}

.page-btn:hover:not(.active) {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #1e3a8a;
}

.page-btn.active {
  background: #1e3a8a;
  border-color: #1e3a8a;
  color: white;
  box-shadow: 0 3px 10px rgba(30, 58, 138, 0.2);
}
/* PAGINAÇÃO COM DOTS */
.pagination-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}

.dots-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #cbd5e1;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dot:hover {
  background: #94a3b8;
  transform: scale(1.2);
}

.dot.active {
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  width: 28px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(30, 58, 138, 0.3);
}
/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero-background {
    min-height: 550px;
    padding-top: 60px;
  }


  .carousel-track {
    flex-wrap: nowrap;
    overflow: visible;
    padding: 0;
    margin-bottom: 20px;          /* controla o espaço aqui */
    justify-content: center;
    align-items: flex-start;
    min-height: auto;             /* remove o min-height fixo */
    height: auto;
  }

  .carousel-slide {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 85% !important;
    max-width: 320px !important;
  }

  .pagination-dots {
    margin-top: 5px;             /* espaço bem menor e controlado */
  }

  .hero-content {
    padding: 1.5rem 0.5rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-features {
    gap: 1rem;
  }

  .feature-item {
    font-size: 0.85rem;
  }

 .search-input-group {
    flex-direction: row;
    padding: 0.5rem;
    border-radius: 50px;
  }

  .search-icon {
    margin-left: 0.5rem;
    font-size: 1.1rem;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem 0.5rem;
    font-size: 0.95rem;
  }

  .search-button {
    width: 48px;
    height: 48px;
    padding: 0;
    border-radius: 50%;
    min-width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button-text-desktop {
    display: none;
  }

  .button-icon-mobile {
    display: block;
    font-size: 1.3rem;
    font-weight: bold;
  }


  .wave-divider {
    height: 80px;
    margin-top: -40px;
  }

  .recent-certifications {
    padding: 30px 0 30px;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .section-subtitle {
    font-size: 0.85rem;
    margin-bottom: 25px;
  }

  .pagination {
    gap: 12px;
    margin-top: 15px;
  }

  .nav-btn {
    width: 48px;
    height: 48px;
    font-size: 1.1rem;
    border-radius: 16px;
    border: 2px solid #e0e7ff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .nav-btn:hover:not(:disabled) {
    background: #3b82f6;
    border-color: #3b82f6;
    transform: scale(1.05);
  }

  .page-numbers {
    display: none;
  }
  
  .cert-card {
    max-width: 320px;
  }
}

@media (max-width: 480px) {
  .hero-background {
    min-height: 500px;
    padding-top: 50px;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .hero-features {
    flex-direction: column;
    gap: 0.75rem;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .section-subtitle {
    font-size: 0.8rem;
  }

  .cert-card {
    border-radius: 16px;
    max-width: 300px;
  }

  .photo-wrapper img {
    width: 75px;
    height: 75px;
  }

  .check-badge {
    width: 28px;
    height: 28px;
  }

  .check-badge i {
    font-size: 16px;
  }

  .student-name {
    font-size: 0.9rem;
  }

  .course-badge span {
    font-size: 0.7rem;
  }

  .info-value {
    font-size: 0.75rem;
  }
  
  .carousel-track {
    min-height: 400px;
  }
  
  .carousel-slide {
    width: 90% !important;
    max-width: 300px !important;
  }

  .pagination {
    gap: 10px;
    margin-top: 12px;
  }

  .nav-btn {
    width: 44px;
    height: 44px;
    font-size: 1rem;
    border-radius: 14px;
  }
}

/* Animations */
@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes slideDown {
  from { 
    opacity: 0; 
    transform: translateY(-20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideInDesktop {
  from { 
    opacity: 0; 
    transform: translateX(50px) scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
}

@keyframes slideOutDesktop {
  from { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
  to { 
    opacity: 0; 
    transform: translateX(-50px) scale(0.95); 
  }
}

@keyframes slideInMobile {
  from { 
    opacity: 0; 
    transform: translate(-50%, 0) translateX(100%) scale(0.9); 
  }
  to { 
    opacity: 1; 
    transform: translate(-50%, 0) translateX(0) scale(1); 
  }
}

@keyframes slideOutMobile {
  from { 
    opacity: 1; 
    transform: translate(-50%, 0) translateX(0) scale(1); 
  }
  to { 
    opacity: 0; 
    transform: translate(-50%, 0) translateX(-100%) scale(0.9); 
  }
}
</style>