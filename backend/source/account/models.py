from django.db import models

class STATICS(models.Model):

    win = models.IntegerField(default=0)
    loss = models.IntegerField(default=0)
    total_match = models.IntegerField(default=0)
    last_match = models.CharField(max_length=10, default="Unnamed")
    xp_total = models.IntegerField(default=0)
    level = models.IntegerField(default=0)
    level_progress_percentage = models.IntegerField(default=0)

    achievements = models.IntegerField(default=1)
    rank = models.IntegerField(default=0)

    def calculate_level(self):

        xps_for_each_level = [0, 100, 300, 600, 1000]

        for i, xp_for_each_level in enumerate(xps_for_each_level, start=0):
            if self.xp_total < xps_for_each_level[1]:
                return 0
            elif self.xp_total <= xp_for_each_level:
                return i - 1

    def level_pogress(self):
        xp_for_each_level = [0, 100, 300, 600, 1000]
        level = self.calculate_level()
        current_level_xp = xp_for_each_level[level]
        next_level_xp = xp_for_each_level[level + 1]
        xp_in_current_level = self.xp_total - current_level_xp
        xp_for_level = next_level_xp - current_level_xp
        return ( xp_in_current_level / xp_for_level ) * 100

    def save(self, *args, **kwargs):
        self.level = self.calculate_level()
        self.level_progress_percentage = self.level_pogress()
        super().save(*args, **kwargs)