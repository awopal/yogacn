import type { Level } from '@/lib/types';
import type { ClassBuilderDraft, ClassBuilderSection } from '@/lib/stores/class-builder-store';

export type ClassTemplate = {
  id: string;
  name: string;
  description: string;
  draft: Pick<
    ClassBuilderDraft,
    'title' | 'intention' | 'level' | 'duration' | 'peakPose' | 'description' | 'mode'
  > & {
    sections: ClassBuilderSection[];
  };
};

const itemNames = (names: string[]) => names.map((name, index) => ({ id: `item-${index}`, name }));
const section = (
  id: string,
  name: string,
  duration: number,
  names: string[],
): ClassBuilderSection => ({
  id,
  name,
  duration,
  items: itemNames(names),
});

export const classTemplates: ClassTemplate[] = [
  {
    id: 'ashtanga-primary-series',
    name: 'Ashtanga Primary Series',
    description:
      'Full Primary Series ตั้งแต่ Sun Salutations, Standing, Seated ไปจนถึง Finishing และพักผ่อน',
    draft: {
      title: 'Ashtanga Primary Series',
      intention: 'ฝึกการเคลื่อนไหวสัมพันธ์กับลมหายใจและสมาธิ',
      description:
        'Full Primary Series ตั้งแต่ Sun Salutations, Standing, Seated ไปจนถึง Finishing และพักผ่อน',
      level: 'advanced' satisfies Level,
      duration: 100,
      peakPose: 'Urdhva Dhanurasana',
      mode: 'live',
      sections: [
        section('opening', 'Opening', 2, ['Samasthiti', 'Opening Chant (optional)']),
        section('sun-salutations', 'Sun Salutations', 13, [
          'Surya Namaskara A — 5 rounds',
          'Surya Namaskara B — 5 rounds',
        ]),
        section('standing', 'Standing Sequence', 20, [
          'Padangusthasana',
          'Padahastasana',
          'Utthita Trikonasana',
          'Parivrtta Trikonasana',
          'Utthita Parsvakonasana',
          'Parivrtta Parsvakonasana',
          'Prasarita Padottanasana A',
          'Prasarita Padottanasana B',
          'Prasarita Padottanasana C',
          'Prasarita Padottanasana D',
          'Parsvottanasana',
          'Utthita Hasta Padangusthasana A',
          'Utthita Hasta Padangusthasana B',
          'Utthita Hasta Padangusthasana C',
          'Ardha Baddha Padmottanasana',
          'Utkatasana',
          'Virabhadrasana A',
          'Virabhadrasana B',
        ]),
        section('seated', 'Seated Sequence', 20, [
          'Dandasana',
          'Paschimottanasana A',
          'Paschimottanasana B',
          'Paschimottanasana C',
          'Purvottanasana',
          'Ardha Baddha Padma Paschimottanasana',
          'Triang Mukhaikapada Paschimottanasana',
          'Janu Sirsasana A',
          'Janu Sirsasana B',
          'Janu Sirsasana C',
          'Marichyasana A',
          'Marichyasana B',
          'Marichyasana C',
          'Marichyasana D',
          'Navasana — 5 rounds',
        ]),
        section('primary-continued', 'Primary Sequence — Continued', 15, [
          'Bhujapidasana',
          'Kurmasana',
          'Supta Kurmasana',
          'Garbha Pindasana',
          'Kukkutasana',
          'Baddha Konasana A',
          'Baddha Konasana B',
          'Baddha Konasana C',
          'Upavistha Konasana A',
          'Upavistha Konasana B',
          'Supta Konasana',
          'Supta Padangusthasana A',
          'Supta Padangusthasana B',
          'Supta Padangusthasana C',
          'Ubhaya Padangusthasana',
          'Urdhva Mukha Paschimottanasana',
          'Setu Bandhasana',
        ]),
        section('backbending', 'Backbending', 7, [
          'Urdhva Dhanurasana — 3 rounds',
          'Paschimottanasana',
        ]),
        section('finishing', 'Finishing Sequence', 13, [
          'Salamba Sarvangasana',
          'Halasana',
          'Karnapidasana',
          'Urdhva Padmasana',
          'Pindasana',
          'Matsyasana',
          'Uttana Padasana',
          'Sirsasana',
          'Urdhva Dandasana',
          'Balasana',
          'Baddha Padmasana',
          'Yoga Mudra',
          'Padmasana',
          'Utpluthih',
        ]),
        section('final-rest', 'Final Rest', 10, ['Rest / Savasana']),
      ],
    },
  },
];

const newId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

/** Clone a template into the existing builder shape. IDs are intentionally regenerated. */
export function cloneTemplate(template: ClassTemplate): ClassBuilderDraft {
  return {
    ...template.draft,
    sections: template.draft.sections.map((sourceSection) => ({
      ...sourceSection,
      id: newId('section'),
      items: sourceSection.items.map((item) => ({ ...item, id: newId('item') })),
    })),
  };
}
