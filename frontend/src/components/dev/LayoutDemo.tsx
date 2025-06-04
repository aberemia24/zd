import React from "react";
import { 
  Container, 
  Grid, 
  FlexLayout, 
  StackLayout, 
  Section 
} from "../primitives";

/**
 * Demo component pentru noile componente de layout
 * Demonstrează utilizarea Container, Grid, FlexLayout, StackLayout și Section
 */
const LayoutDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-carbon-900 dark:text-carbon-100">
        Layout Components Demo
      </h1>

      {/* Container Demo */}
      <Section variant="elevated" padding="lg">
        <Container maxWidth="4xl" padding="lg">
          <h2 className="text-2xl font-semibold mb-4 text-carbon-800 dark:text-carbon-200">
            Container Component
          </h2>
          <p className="text-carbon-600 dark:text-carbon-400">
            Container component cu max-width 4xl și padding lg. 
            Oferă consistent content width și responsive padding.
          </p>
        </Container>
      </Section>

      {/* Grid Demo */}
      <Section variant="primary" padding="lg">
        <Container>
          <h2 className="text-2xl font-semibold mb-4 text-carbon-800 dark:text-carbon-200">
            Grid Component
          </h2>
          <Grid cols={3} gap={6} responsive={true} className="mb-4">
            <div className="bg-copper-100 dark:bg-copper-900 p-4 rounded-lg">
              <h3 className="font-medium text-copper-800 dark:text-copper-200">Grid Item 1</h3>
              <p className="text-copper-600 dark:text-copper-400">Content pentru primul item</p>
            </div>
            <div className="bg-copper-100 dark:bg-copper-900 p-4 rounded-lg">
              <h3 className="font-medium text-copper-800 dark:text-copper-200">Grid Item 2</h3>
              <p className="text-copper-600 dark:text-copper-400">Content pentru al doilea item</p>
            </div>
            <div className="bg-copper-100 dark:bg-copper-900 p-4 rounded-lg">
              <h3 className="font-medium text-copper-800 dark:text-copper-200">Grid Item 3</h3>
              <p className="text-copper-600 dark:text-copper-400">Content pentru al treilea item</p>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* FlexLayout Demo */}
      <Section variant="secondary" padding="lg">
        <Container>
          <h2 className="text-2xl font-semibold mb-4 text-carbon-800 dark:text-carbon-200">
            FlexLayout Component
          </h2>
          <FlexLayout direction="row" justify="between" align="center" gap={4} className="mb-4">
            <div className="bg-carbon-200 dark:bg-carbon-700 p-4 rounded-lg">
              <span className="text-carbon-800 dark:text-carbon-200">Flex Item 1</span>
            </div>
            <div className="bg-carbon-200 dark:bg-carbon-700 p-4 rounded-lg">
              <span className="text-carbon-800 dark:text-carbon-200">Flex Item 2</span>
            </div>
            <div className="bg-carbon-200 dark:bg-carbon-700 p-4 rounded-lg">
              <span className="text-carbon-800 dark:text-carbon-200">Flex Item 3</span>
            </div>
          </FlexLayout>
        </Container>
      </Section>

      {/* StackLayout Demo */}
      <Section variant="default" padding="lg">
        <Container>
          <h2 className="text-2xl font-semibold mb-4 text-carbon-800 dark:text-carbon-200">
            StackLayout Component
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vertical Stack */}
            <div>
              <h3 className="text-lg font-medium mb-2 text-carbon-700 dark:text-carbon-300">
                Vertical Stack
              </h3>
              <StackLayout direction="vertical" spacing={3} align="stretch">
                <div className="bg-carbon-100 dark:bg-carbon-800 p-3 rounded">
                  Stack Item 1
                </div>
                <div className="bg-carbon-100 dark:bg-carbon-800 p-3 rounded">
                  Stack Item 2
                </div>
                <div className="bg-carbon-100 dark:bg-carbon-800 p-3 rounded">
                  Stack Item 3
                </div>
              </StackLayout>
            </div>

            {/* Horizontal Stack */}
            <div>
              <h3 className="text-lg font-medium mb-2 text-carbon-700 dark:text-carbon-300">
                Horizontal Stack
              </h3>
              <StackLayout direction="horizontal" spacing={3} align="center">
                <div className="bg-carbon-100 dark:bg-carbon-800 p-3 rounded">
                  Item A
                </div>
                <div className="bg-carbon-100 dark:bg-carbon-800 p-3 rounded">
                  Item B
                </div>
                <div className="bg-carbon-100 dark:bg-carbon-800 p-3 rounded">
                  Item C
                </div>
              </StackLayout>
            </div>
          </div>
        </Container>
      </Section>

      {/* Complex Layout Demo */}
      <Section variant="elevated" padding="xl">
        <Container maxWidth="6xl">
          <h2 className="text-2xl font-semibold mb-6 text-carbon-800 dark:text-carbon-200">
            Complex Layout Example
          </h2>
          <Grid cols={12} gap={6}>
            {/* Sidebar */}
            <div className="col-span-12 md:col-span-3">
              <StackLayout direction="vertical" spacing={4}>
                <div className="bg-copper-50 dark:bg-copper-950 p-4 rounded-lg border border-copper-200 dark:border-copper-800">
                  <h3 className="font-medium text-copper-800 dark:text-copper-200 mb-2">
                    Navigation
                  </h3>
                  <StackLayout direction="vertical" spacing={2}>
                    <a href="#" className="text-copper-600 dark:text-copper-400 hover:text-copper-800 dark:hover:text-copper-200">
                      Dashboard
                    </a>
                    <a href="#" className="text-copper-600 dark:text-copper-400 hover:text-copper-800 dark:hover:text-copper-200">
                      Transactions
                    </a>
                    <a href="#" className="text-copper-600 dark:text-copper-400 hover:text-copper-800 dark:hover:text-copper-200">
                      Categories
                    </a>
                  </StackLayout>
                </div>
              </StackLayout>
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-9">
              <StackLayout direction="vertical" spacing={6}>
                {/* Header */}
                <FlexLayout direction="row" justify="between" align="center">
                  <h3 className="text-xl font-semibold text-carbon-800 dark:text-carbon-200">
                    Main Content Area
                  </h3>
                  <div className="bg-copper-500 text-white px-4 py-2 rounded-lg">
                    Action Button
                  </div>
                </FlexLayout>

                {/* Content Grid */}
                <Grid cols={2} gap={4} responsive={true}>
                  <div className="bg-carbon-50 dark:bg-carbon-900 p-6 rounded-lg border border-carbon-200 dark:border-carbon-700">
                    <h4 className="font-medium text-carbon-800 dark:text-carbon-200 mb-2">
                      Card 1
                    </h4>
                    <p className="text-carbon-600 dark:text-carbon-400">
                      Content pentru primul card în layout-ul complex.
                    </p>
                  </div>
                  <div className="bg-carbon-50 dark:bg-carbon-900 p-6 rounded-lg border border-carbon-200 dark:border-carbon-700">
                    <h4 className="font-medium text-carbon-800 dark:text-carbon-200 mb-2">
                      Card 2
                    </h4>
                    <p className="text-carbon-600 dark:text-carbon-400">
                      Content pentru al doilea card în layout-ul complex.
                    </p>
                  </div>
                </Grid>
              </StackLayout>
            </div>
          </Grid>
        </Container>
      </Section>
    </div>
  );
};

export default LayoutDemo; 