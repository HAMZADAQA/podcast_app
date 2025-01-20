import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PodcastProvider } from './context/PodcastContext';
import Header from './components/Header/Header';
import Spinner from './components/Spinner/Spinner';

const MainView = lazy(() => import('./pages/MainView/MainView'));
const PodcastDetail = lazy(() => import('./pages/PodcastDetail/PodcastDetail'));
const EpisodeDetail = lazy(
  () => import('./pages/PodcastEpisode/PodcastEpisode')
);

const App: React.FC = () => {
  return (
    <PodcastProvider>
      <Router>
        <Header />
        <main className='mainContainer'>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path='/' element={<MainView />} />
              <Route path='/podcast/:podcastId' element={<PodcastDetail />} />
              <Route
                path='/podcast/:podcastId/episode/:episodeId'
                element={<EpisodeDetail />}
              />
            </Routes>
          </Suspense>
        </main>
      </Router>
    </PodcastProvider>
  );
};
export default App;
