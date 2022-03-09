<script setup>
import WelcomeItem from './WelcomeItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import EcosystemIcon from './icons/IconEcosystem.vue'
import CommunityIcon from './icons/IconCommunity.vue'
import SupportIcon from './icons/IconSupport.vue'
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Waarom</template>

    Met de vaardigheden die je hebt kan je ook andere beroepen uitoefenen dan die je tot nu toe hebt gedaan.
    Deze app doet dat op basis van de 
    <a target="_blank" href="https://www.werk.nl/arbeidsmarktinformatie/skills/competentnl-standaard-voor-skills-in-nederland">CompetentNL</a>
    standaard
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Wat</template>

    De app maakt een CV 2.0 en laat een overzicht van je vaardigheden zien. Dat kan je dan vergelijken met vaardigheden van wensberoepen.
    Zo kan je zien aan welke vaardigheden je nog moet werken.

  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Hoe</template>
    Vul het CV formulier in en kies vervolgens een wensberoep. 
    Daarna krijg je een overzicht van vaardigheden die nog nodig zijn om je wensberoep te kunnen uitoefenen.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Waarmee</template>
    Er zijn verschillende instrumenten waarmee competenties en vaardigheden worden verkregen.
    Bekijk  <a target="_blank" href="https://www.vngrealisatie.nl/producten/instrumentengidsen-dennis-en-eva">hier</a> de lijst.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Hulp</template>

    Vraag advies aan je consulent bij je gemeente
  </WelcomeItem>
</template>
