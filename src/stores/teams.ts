import { defineStore } from 'pinia';
import type { Team } from '@/types/Team';

export const useTeamsStore = defineStore({
  id: 'teams',
  state: () => ({
    teams: [] as Team[],
    team: null as null | Team,
  }),
  actions: {
    setTeams(teams: Team[]) {
      this.teams = teams;
    },
    setTeam(team: Team) {
      this.team = team;
    },
  },
});
