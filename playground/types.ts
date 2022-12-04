import type { Component } from 'vue';

export interface Example {
  title: string;
  id: string;
  repoLink: string;
  component: Component;
}

export interface DemoItemMetaData {
  text: string;
}
