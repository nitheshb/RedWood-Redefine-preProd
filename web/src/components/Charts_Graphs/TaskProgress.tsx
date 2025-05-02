import { Box, LinearProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/context/firebase-auth-context'
const TaskProgress = ({ userTodayPerfA }) => {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <section className="bg-white rounded-lg  flex flex-col p-4 w-100 ">
      <h5>{t('Task Progress')}</h5>

      <Box mt={2}>
        <div className="flex flex-row align-middle justify-between">
          <h6 className="font-bodyLato font-semibold text-sm">{t('New')}</h6>
          <span className="font-bodyLato text-[12px] text-[#94A4C4]">
            {userTodayPerfA?.new_comp || 0}/{userTodayPerfA?.new}
          </span>
        </div>
      </Box>
      <Box mt={3}>
        <div className="flex flex-row align-middle justify-between">
          <h6 className="font-bodyLato font-semibold text-sm">
            {t('Followup')}
          </h6>
          <span className="font-bodyLato text-[12px] text-[#94A4C4]">
            {userTodayPerfA?.followup_comp || 0}/{userTodayPerfA?.followup}
          </span>
        </div>
        <LinearProgress
          variant="determinate"
          color="info"
          value={
            userTodayPerfA?.followup_comp || 0 / userTodayPerfA?.followup || 0
          }
          style={{
            backgroundColor: '#E5EAF2',
            borderRadius: '3px',
            height: '4px',
          }}
        />
      </Box>

      <Box mt={3}>
        <div className="flex flex-row align-middle justify-between">
          <h6 className="font-bodyLato font-semibold text-sm">
            {t('Visits Fixed')}
          </h6>
          <span className="font-bodyLato text-[12px] text-[#94A4C4]">
            {userTodayPerfA?.visitfixed_comp || 0}/{userTodayPerfA?.visitfixed}
          </span>
        </div>
        <LinearProgress
          value={
            userTodayPerfA?.visitfixed_comp ||
            0 / userTodayPerfA?.visitfixed ||
            0
          }
          color="warning"
          variant="determinate"
          style={{
            backgroundColor: '#E5EAF2',
            borderRadius: '3px',
            height: '4px',
            color: '#FFE91F',
          }}
        />
      </Box>

      <Box mt={3}>
        <div className="flex flex-row align-middle justify-between">
          <h6 className="font-bodyLato font-semibold text-sm">
            {t('Negotiation')}
          </h6>
          <span className="font-bodyLato text-[12px] text-[#94A4C4]">
            {userTodayPerfA?.negotiation_comp || 0}/
            {userTodayPerfA?.negotiation}
          </span>
        </div>
        <LinearProgress
          variant="determinate"
          value={
            userTodayPerfA?.negotiation_comp ||
            0 / userTodayPerfA?.negotiation ||
            0
          }
          color="success"
          style={{
            borderRadius: '3px',
            height: '4px',
            color: '#FD396D',
            backgroundColor: '#E5EAF2',
          }}
        />
      </Box>
    </section>
  )
}
export default TaskProgress
