<template>
  <div>
    <HeroDeclaracoes />

    <!-- Passa os dados já carregados -->
    <UltimasDeclaracoes 
      :declaracoes="declaracoes" 
      @viewDetails="openModal" 
    />

    <BuscarDeclaracoes 
      :declaracoes="declaracoes" 
      @viewDetails="openModal" 
    />

    <!-- Modal -->
    <DetalheDeclaracoes
      v-if="selectedDeclaracao"
      :selectedDeclaracao="selectedDeclaracao"
      @close="closeModal"
    />

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
     
    </div>
  </div>
</template>

<script>
import CertificationsService from "@/components/services/certifications";
import DetalheDeclaracoes from "@/pages/DetalheDeclaracoes.vue";
import HeroDeclaracoes from "@/pages/HeroDeclaracoes.vue";
import UltimasDeclaracoes from "@/pages/UltimasDeclaracoes.vue";
import BuscarDeclaracoes from "@/pages/BuscaDeclaracoes.vue";

export default {
  name: "DeclaracoesHome",
  components: {
    DetalheDeclaracoes,
    HeroDeclaracoes,
    UltimasDeclaracoes,
    BuscarDeclaracoes,
  },
  props: {
    uniqueLink: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      declaracoes: [],
      selectedDeclaracao: null,
      loading: false,
    };
  },
  async mounted() {
    await this.loadAllDeclaracoes();

    if (this.uniqueLink) {
      await this.loadDeclaracaoByLink(this.uniqueLink);
    }
  },
  methods: {
    // 🔹 Carrega todas as certificações uma única vez
    async loadAllDeclaracoes() {
      try {
        this.loading = true;
        const response = await CertificationsService.getAll();

        // Caso o backend retorne { count, results: [...] }
        this.declaracoes = Array.isArray(response)
          ? response
          : response.results || [];

        // Normaliza os campos (opcional)
        this.declaracoes = this.declaracoes.map((item) => ({
          id: item.id,
          nomeCompleto: item.nome_completo,
          curso: item.curso,
          cargaHoraria: item.carga_horaria,
          dataConclusao: item.data_conclusao,
          codigo: item.codigo,
          status: item.status,
          declaracao:
            item.declaracao ||
            `Certificamos que o(a) ${item.nome_completo} concluiu o curso de ${item.curso}.`,
          duracao: item.duracao,
          documento: item.documento,
          foto: item.foto
            ? item.foto.startsWith("http")
              ? item.foto
              // : `https://cestificacoesiso-back.onrender.com${item.foto}`
              : `http://127.0.0.1:8000/${item.foto}`
            : "https://via.placeholder.com/90",
          modulos: item.modulos || [],
          unique_link: item.unique_link,
          link_completo: item.link_completo,
        }));
      } catch (error) {
        console.error("Erro ao carregar certificações:", error);
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Busca apenas uma declaração via link único (quando necessário)
    async loadDeclaracaoByLink(uniqueLink) {
      try {
        this.loading = true;
        const data = await CertificationsService.getByUniqueLink(uniqueLink);

        const declaracao = {
          id: data.id,
          nomeCompleto: data.nome_completo,
          documento: data.documento,
          curso: data.curso,
          duracao: data.duracao,
          cargaHoraria: data.carga_horaria,
          dataConclusao: data.data_conclusao,
          codigo: data.codigo,
          status: data.status,
          unique_link: data.unique_link,
          declaracao:
            data.declaracao ||
            `Declaramos que ${data.nome_completo} concluiu o curso ${data.curso}.`,
          foto: data.foto
            ? data.foto.startsWith("http")
              ? data.foto
              : `https://cestificacoesiso-back.onrender.com${data.foto}`
            : "https://via.placeholder.com/90",
          modulos: data.modulos || [],
        };

        this.openModal(declaracao);
      } catch (error) {
        console.error("Erro ao buscar por link:", error);
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Modal
    openModal(declaracao) {
      this.selectedDeclaracao = declaracao;
      document.body.style.overflow = "hidden";
    },
    closeModal() {
      this.selectedDeclaracao = null;
      document.body.style.overflow = "auto";

      if (this.uniqueLink) {
        this.$router.push({ name: "declaracoes" });
      }
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-container {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
