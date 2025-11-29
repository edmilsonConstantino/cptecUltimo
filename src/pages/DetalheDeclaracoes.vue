<template>
  <div v-if="selectedDeclaracao" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <button @click="closeModal" class="modal-close">
        <i class="bi bi-x"></i>
      </button>

      <div class="certificate-wrapper" v-if="!isMobile">
        <div class="certificate-header">
          <div class="institution-block">
            <div class="logo-circle">
              <i class="bi bi-mortarboard"></i>
            </div>
            <div class="institution-info">
              <h2>Centro de Formação Profissional</h2>
              <p>Reconhecido pelo Ministério da Educação</p>
            </div>
          </div>

          <div class="student-block">
            <div class="student-photo">
              <img
                :src="selectedDeclaracao.foto"
                :alt="selectedDeclaracao.nomeCompleto"
                @error="handleImageError"
              />
            </div>
            <h3>{{ selectedDeclaracao.nomeCompleto }}</h3>
            <div class="badge-success">
              <i class="bi bi-check-circle-fill"></i>
              Concluído
            </div>
          </div>
        </div>

        <div class="certificate-body">
          <div class="title-section">
            <div class="line-ornament"></div>
            <h1>DECLARAÇÃO DE CONCLUSÃO</h1>
            <div class="line-ornament"></div>
          </div>

          <div class="declaration-text">
            <p v-html="getDeclaracaoTexto()"></p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <i class="bi bi-mortarboard"></i>
              <div class="info-content">
                <span class="label">CURSO</span>
                <strong>{{ selectedDeclaracao.curso }}</strong>
              </div>
            </div>

            <div class="info-item">
              <i class="bi bi-calendar-check"></i>
              <div class="info-content">
                <span class="label">DURAÇÃO</span>
                <strong>{{ selectedDeclaracao.duracao }}</strong>
              </div>
            </div>

            <div class="info-item">
              <i class="bi bi-clock"></i>
              <div class="info-content">
                <span class="label">CARGA HORÁRIA</span>
                <strong>{{ selectedDeclaracao.cargaHoraria }}</strong>
              </div>
            </div>

            <div class="info-item">
              <i class="bi bi-calendar3"></i>
              <div class="info-content">
                <span class="label">DATA DE CONCLUSÃO</span>
                <strong>{{ formatDateFull(selectedDeclaracao.dataConclusao) }}</strong>
              </div>
            </div>
          </div>

          <div v-if="modulos && modulos.length > 0" class="modules-section">
            <h3 class="modules-title">
              <i class="bi bi-list-check"></i> Módulos Concluídos
            </h3>
            <div class="modules-grid">
              <div v-for="(modulo, index) in modulos" :key="index" class="module-card">
                <div class="module-number">{{ index + 1 }}</div>
                <div class="module-name">{{ modulo.nome || modulo }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="certificate-mobile" v-else>
        <div class="mobile-header">
          <div class="mobile-photo">
            <img
              :src="selectedDeclaracao.foto"
              :alt="selectedDeclaracao.nomeCompleto"
              @error="handleImageError"
            />
            <div class="photo-badge">
              <i class="bi bi-award"></i>
            </div>
          </div>
          <h3>{{ selectedDeclaracao.nomeCompleto }}</h3>
          <p>{{ selectedDeclaracao.curso }}</p>
          <div class="badge-success">
            <i class="bi bi-check-circle-fill"></i>
            Concluído
          </div>
        </div>

        <div class="mobile-body">
          <h2>DECLARAÇÃO DE CONCLUSÃO</h2>

          <div class="mobile-text">
            <p v-html="getDeclaracaoTexto()"></p>
          </div>

          <div class="mobile-info">
            <div class="mobile-info-row">
              <i class="bi bi-calendar-check"></i>
              <div>
                <span>Duração</span>
                <strong>{{ selectedDeclaracao.duracao }}</strong>
              </div>
            </div>

            <div class="mobile-info-row">
              <i class="bi bi-clock"></i>
              <div>
                <span>Carga Horária</span>
                <strong>{{ selectedDeclaracao.cargaHoraria }}</strong>
              </div>
            </div>

            <div class="mobile-info-row">
              <i class="bi bi-calendar3"></i>
              <div>
                <span>Conclusão</span>
                <strong>{{ formatDateFull(selectedDeclaracao.dataConclusao) }}</strong>
              </div>
            </div>
          </div>

          <div v-if="modulos && modulos.length > 0" class="modules-section mobile-modules">
            <h3 class="modules-title">
              <i class="bi bi-list-check"></i> Módulos Concluídos
            </h3>
            <div class="modules-list-mobile">
              <div v-for="(modulo, index) in modulos" :key="index" class="module-item-mobile">
                <span class="module-number-mobile">{{ index + 1 }}</span>
                <span class="module-name-mobile">{{ modulo.nome || modulo }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CertificationsService from "@/components/services/certifications.js";

export default {
  name: "DetailsModal",
  props: {
    selectedDeclaracao: {
      type: Object,
      default: null
    },
    uniqueLink: {
      type: String,
      default: null
    }
  },
  emits: ["close", "update:selectedDeclaracao"],
  data() {
    return {
      isMobile: false,
      modulos: []
    };
  },
  async mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);

    if (this.uniqueLink && !this.selectedDeclaracao) {
      await this.fetchDeclaracao(this.uniqueLink);
    } else if (this.selectedDeclaracao) {
      this.modulos = this.selectedDeclaracao.modulos || [];
      console.log("Módulos recebidos no modal:", this.modulos);
      console.log('📸 Foto recebida no modal:', {
        nome: this.selectedDeclaracao.nomeCompleto,
        foto: this.selectedDeclaracao.foto
      });
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },

    closeModal() {
      this.$emit("close");
      document.body.style.overflow = "auto";
    },

    formatDateFull(dateString) {
      if (!dateString) return "Data não disponível";
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    },

    handleImageError(event) {
      console.log('❌ Erro ao carregar imagem no modal:', event.target.src);
      if (this.selectedDeclaracao && this.selectedDeclaracao.nomeCompleto) {
        event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.selectedDeclaracao.nomeCompleto)}&background=667eea&color=fff&size=200`;
      } else {
        event.target.src = "https://ui-avatars.com/api/?name=User&background=667eea&color=fff&size=200";
      }
    },

    async fetchDeclaracao(uniqueLink) {
      try {
        const data = await CertificationsService.getByUniqueLink(uniqueLink);
        this.$emit("update:selectedDeclaracao", data);
        this.modulos = data.modulos || [];
        console.log("Módulos carregados do backend:", this.modulos);
        console.log('📸 Foto carregada do backend:', {
          nome: data.nomeCompleto,
          foto: data.foto
        });
      } catch (error) {
        console.error("Erro ao buscar declaração:", error);
      }
    },

    getDeclaracaoTexto() {
      const declaracao = this.selectedDeclaracao?.declaracao;
      
      if (declaracao && declaracao.trim() !== "") {
        return declaracao;
      } else {
        const nome = this.selectedDeclaracao?.nomeCompleto || "________________";
        const curso = this.selectedDeclaracao?.curso || "________________";
        const carga = this.selectedDeclaracao?.cargaHoraria || "não informada";
        const duracao = this.selectedDeclaracao?.duracao || "não informada";

        return `
          Certificamos que o(a) <strong>${nome}</strong> concluiu com aproveitamento o curso de
          <strong>${curso}</strong>, com carga horária de <strong>${carga}</strong>, no período de
          <strong>${duracao}</strong>. Esta declaração é emitida para os devidos fins.
        `;
      }
    }
  },

  watch: {
    selectedDeclaracao(newVal) {
      if (newVal) {
        document.body.style.overflow = "hidden";
        this.checkMobile();
        this.modulos = newVal.modulos || [];
        console.log("Módulos atualizados:", this.modulos);
        console.log('📸 Foto atualizada:', {
          nome: newVal.nomeCompleto,
          foto: newVal.foto
        });
      }
    },

    uniqueLink: {
      immediate: true,
      async handler(newLink) {
        if (newLink && !this.selectedDeclaracao) {
          await this.fetchDeclaracao(newLink);
        }
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 1100px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  color: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  font-size: 26px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.modal-close:hover {
  background: #dc3545;
  color: white;
  transform: rotate(90deg);
}

/* DESKTOP VERSION */
.certificate-wrapper {
  padding: 30px 35px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 18px;
  border-bottom: 2px solid #e8e8e8;
  margin-bottom: 20px;
}

.institution-block {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-circle {
  width: 65px;
  height: 65px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 30px;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.institution-info h2 {
  font-size: 20px;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 2px;
  line-height: 1.2;
}

.institution-info p {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
}

.student-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.student-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #667eea;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.student-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-block h3 {
  font-size: 17px;
  font-weight: 800;
  color: #2c3e50;
  text-align: center;
  line-height: 1.2;
}

.badge-success {
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 3px 8px rgba(40, 167, 69, 0.3);
}

.certificate-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.title-section {
  text-align: center;
}

.line-ornament {
  width: 90px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
  margin: 8px auto;
}

.title-section h1 {
  font-size: 26px;
  font-weight: 900;
  color: #2c3e50;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.declaration-text {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  padding: 18px;
  border-radius: 10px;
  border-left: 3px solid #667eea;
}

.declaration-text p {
  font-size: 14px;
  line-height: 1.65;
  color: #495057;
  text-align: justify;
  margin: 0;
  text-transform: uppercase;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.info-item {
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.info-item i {
  font-size: 26px;
  color: #667eea;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-content .label {
  font-size: 9px;
  font-weight: 700;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-content strong {
  font-size: 13px;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1.3;
}

.modules-section {
  margin-top: 0;
  padding: 18px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03));
  border-radius: 10px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.modules-title {
  font-size: 17px;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.modules-title i {
  color: #667eea;
  font-size: 19px;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.module-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.module-number {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.module-name {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

/* MOBILE VERSION */
.certificate-mobile {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow-y: auto;
}

.mobile-header {
  background: linear-gradient(135deg, #667eea 0%, #3b82f6 100%);
  padding: 70px 18px 25px;
  color: white;
  text-align: center;
}

.mobile-photo {
  width: 80px;
  height: 80px;
  margin: 0 auto 12px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  position: relative;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.mobile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, #ffc107, #ff8c00);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border: 2px solid white;
}

.mobile-header h3 {
  font-size: 19px;
  font-weight: 800;
  margin-bottom: 6px;
  line-height: 1.2;
}

.mobile-header p {
  font-size: 13px;
  opacity: 0.95;
  margin-bottom: 12px;
}

.mobile-body {
  flex: 1;
  padding: 25px 18px;
  background: white;
}

.mobile-body h2 {
  font-size: 18px;
  font-weight: 900;
  color: #2c3e50;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 18px;
}

.mobile-text {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  padding: 16px;
  border-radius: 10px;
  border-left: 3px solid #667eea;
  margin-bottom: 18px;
}

.mobile-text p {
  font-size: 13px;
  line-height: 1.6;
  color: #495057;
  margin: 0;
  text-transform: uppercase;
}

.mobile-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 12px;
}

.mobile-info-row i {
  font-size: 24px;
  color: #667eea;
  flex-shrink: 0;
}

.mobile-info-row div {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-info-row span {
  font-size: 10px;
  font-weight: 700;
  color: #6c757d;
  text-transform: uppercase;
}

.mobile-info-row strong {
  font-size: 13px;
  font-weight: 800;
  color: #2c3e50;
}

.mobile-modules {
  margin-top: 18px;
  padding: 16px;
}

.modules-list-mobile {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-item-mobile {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.module-number-mobile {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea, #3b82f6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.module-name-mobile {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.3;
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .modules-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    border-radius: 0;
    max-width: 100%;
    height: 100vh;
    max-height: 100vh;
  }

  .modal-close {
    background: rgba(255, 255, 255, 0.95);
  }
}

@media (max-width: 576px) {
  .mobile-header {
    padding: 65px 15px 22px;
  }

  .mobile-body {
    padding: 22px 15px;
  }

  .mobile-body h2 {
    font-size: 16px;
  }

  .mobile-text {
    padding: 14px;
  }

  .mobile-text p {
    font-size: 12px;
  }
  
  .modules-section {
    padding: 14px;
  }
  
  .modules-title {
    font-size: 16px;
  }
}
</style>