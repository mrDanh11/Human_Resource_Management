import { CircleArrowRight } from 'lucide-react';
import type { ParticipationData } from '../../types/activity';

interface ActivityListCardProps {
    activity: ParticipationData;
    onViewResult: (activityId: number) => void;
}

export default function ActivityListResultCard({
    activity,
    onViewResult
}: ActivityListCardProps) {

    console.log("Activity:", activity);

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Image */}
            {activity.activityId && (
                <div className="h-48 overflow-hidden">
                    <img
                        src={activity.imgPath}
                        alt={activity.activityName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="p-6">
                {/* Activity Name */}
                <h3 className="text-xl font-bold text-gray-900 flex-1">
                    {activity.activityName}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {activity.description}
                </p>


                {/* Actions */}
                <div className="flex gap-3">

                    <button
                        onClick={() => onViewResult(activity.activityId)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                        style={{
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 5px 20px rgba(37, 99, 235, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <CircleArrowRight className="w-4 h-4" />
                        <span className="font-medium">Xem kết quả</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
