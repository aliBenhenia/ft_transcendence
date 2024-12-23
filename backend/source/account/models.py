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
        if self.xp_total == 0:
            return 0
    
        xps_for_each_level = [100, 300, 600, 1000]

        for i, xp_for_each_level in enumerate(xps_for_each_level, start=1):
            if self.xp_total < xp_for_each_level:
                return i - 1

    def level_pogress(self):
        xp_for_each_level = [100, 300, 600, 1000]
        level = self.calculate_level()
        current_level_xp = xp_for_each_level[level - 1]
        next_level_xp = xp_for_each_level[level]
        xp_in_current_level = self.xp_total - current_level_xp
        xp_needed_for_next_level = next_level_xp - xp_in_current_level
        return (xp_in_current_level / xp_needed_for_next_level) * 100

    def save(self, *args, **kwargs):
        self.level = self.calculate_level()
        self.level_progress_percentage = self.level_pogress()
        super().save(*args, **kwargs)

    # def level_up(self):
    #     if self.xp_total >= 100:
    #         self.xp_total = 0
    #         self.change_rank()
    #         if self.achievements + 1 <= 15:
    #             self.achievements += 1 
    #         self.save()
    #         return True
    #     return False
    
    # def change_rank(self):
    #     if self.rank - 1 > 0:
    #         secondary = STATICS.objects.get(rank=self.rank - 1)
    #         secondary.rank += 1
    #         secondary.save()

    #         self.rank -= 1
    #         self.save()
